import json
import os
import asyncio
import logging
from typing import AsyncGenerator
from dotenv import load_dotenv
from schema.chat_model import ChatRequest
from schema.a2a_schema import A2AEnvelope
from services.llm_pool_manager import llm_pool_manager
from services.safety_engine import safety_engine
from services.rag_router import rag_router
from services.a2a_bus import a2a_bus
from services.evidence_engine import evidence_engine
from services.persona_adapter import persona_adapter
from services.internal_tools.open_meteo import get_marine_weather_forecast
from services.internal_tools.ocean_service import get_ocean_intelligence
from services.internal_tools.geofence_service import evaluate_geofence

load_dotenv()
logger = logging.getLogger("orca.orchestrator")


async def call_orchestrator(user_data: ChatRequest) -> AsyncGenerator[str, None]:
    """
    Main Multi-Agent Orchestrator Pipeline (ISRO Baseline Specification).
    Steps:
      1. Safety Guard Evaluation (Deterministic Pre-LLM Hazard Check)
      2. RAG Dynamic Router (Static Docs vs Agentic A2A Network)
      3. A2A Parallel Tool Dispatching (Weather + Ocean + Spatial + Geofence)
      4. Evidence Package & Conflict Synthesis
      5. 5-Level Persona Response Formatting
      6. Multilingual Translation & SSE Streaming
    """
    trace_id = f"orca-trace-{os.urandom(4).hex()}"
    role = user_data.role or "fisherman"
    disclosure_level = user_data.disclosure_level or 2
    lang = (user_data.lang or "en").lower()

    # Step 1: Pre-Execution Safety Check
    # Fetch fast weather & spatial bounds for safety evaluation
    weather_data = {}
    spatial_data = {}
    try:
        weather_data = await get_marine_weather_forecast(user_data.lat, user_data.long)
        spatial_data = await evaluate_geofence(user_data.lat, user_data.long)
    except Exception as e:
        logger.warning(f"Fast safety fetch warning: {e}")

    safety_eval = safety_engine.evaluate_safety(
        user_data.lat, user_data.long, weather_data, spatial_data
    )

    yield f'data: {{"type": "hazard_alert", "name": "safety_engine", "content": {json.dumps(safety_eval, ensure_ascii=False)}}}\n\n'

    # Step 2: Route Classifier
    route_info = rag_router.route_query(user_data.prompt)
    route_name = route_info.get("route", "")
    route_reason = route_info.get("reason", "")
    yield f'data: {{"type": "thought", "name": "rag_router", "content": "Query routed to {route_name}: {route_reason}"}}\n\n'

    # Step 3: Parallel Tool Execution via A2A Bus
    yield f'data: {{"type": "thought", "name": "planner_agent", "content": "Decomposing task into parallel domain requests for Weather, Oceanography, and Spatial Geofencing..."}}\n\n'

    ocean_task = get_ocean_intelligence(user_data.lat, user_data.long)
    weather_task = get_marine_weather_forecast(user_data.lat, user_data.long)
    geofence_task = evaluate_geofence(user_data.lat, user_data.long)

    ocean_res, weather_res, geofence_res = await asyncio.gather(
        ocean_task, weather_task, geofence_task, return_exceptions=True
    )

    raw_results = {
        "ocean": ocean_res if isinstance(ocean_res, dict) else {},
        "weather": weather_res if isinstance(weather_res, dict) else {},
        "spatial": geofence_res if isinstance(geofence_res, dict) else {},
    }

    yield f'data: {{"type": "a2a_step", "sender": "planner_agent", "target": "domain_agents", "intent": "parallel_fetch_complete"}}\n\n'

    # Step 4: Build Evidence Package
    evidence_package = evidence_engine.build_evidence_package(raw_results)
    yield f'data: {{"type": "evidence", "name": "evidence_synthesizer", "content": {json.dumps(evidence_package.model_dump(), ensure_ascii=False)}}}\n\n'

    # Step 5: Format Response according to Persona & Disclosure Level
    formatted_response = persona_adapter.format_response(
        evidence=evidence_package,
        role=role,
        disclosure_level=disclosure_level,
        safety_status=safety_eval,
        user_prompt=user_data.prompt,
    )

    # Step 6: Translation if non-English
    final_output = formatted_response
    if lang not in ["english", "en", "en-in"]:
        try:
            sarvam_key = os.getenv("SARVAM_API_KEY")
            if sarvam_key:
                from sarvamai import SarvamAI

                client = SarvamAI(api_subscription_key=sarvam_key)

                def sync_translate():
                    return client.text.translate(
                        input=final_output,
                        source_language_code="en-IN",
                        target_language_code=lang,
                    )

                translated_res = await asyncio.to_thread(sync_translate)
                final_output = translated_res.translated_text
        except Exception as e:
            logger.warning(f"Sarvam AI translation error: {e}. Fallback to LLM translation.")
            try:
                llm = llm_pool_manager.get_llm(model_tier="fast")
                from langchain.messages import HumanMessage

                translate_prompt = (
                    f"Translate the following marine advisory to language '{lang}'. "
                    f"Keep formatting intact and output ONLY the translation:\n\n{final_output}"
                )
                translated = await llm.ainvoke([HumanMessage(content=translate_prompt)])
                final_output = translated.content
            except Exception as tr_err:
                logger.error(f"Fallback translation error: {tr_err}")

    yield f'data: {{"type": "persona_response", "role": "{role}", "disclosure_level": {disclosure_level}, "content": {json.dumps(final_output, ensure_ascii=False)}}}\n\n'
    yield f'data: {{"type": "final", "name": "orchestrator", "content": {json.dumps(final_output, ensure_ascii=False)}}}\n\n'
