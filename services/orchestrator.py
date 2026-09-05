from langchain_groq import ChatGroq
from langchain.messages import HumanMessage, AIMessage, SystemMessage
from dotenv import load_dotenv
from services.extract_tool import extract_json_between_tags
from schema.chat_model import ChatRequest
import datetime
import os
from services.agent_service import call_agent
from prompts.system_prompts import ORCHESTRATOR_SYSTEM_PROMPT

load_dotenv()

# Maps internal tool names to a human-readable source label for the
# structured response contract (PRD spec §41).
SOURCE_LABELS = {
    "get_marine_weather_forecast": "Open-Meteo Marine Weather API",
    "get_pfz_by_location": "INCOIS Potential Fishing Zone Advisory",
}


def _build_structured_response(answer: str, evidence: list, lang: str) -> dict:
    sources = sorted({SOURCE_LABELS.get(e["tool"], e["tool"]) for e in evidence})
    limitations = [
        f'{SOURCE_LABELS.get(e["tool"], e["tool"])} unavailable: {e["result"]}'
        for e in evidence
        if str(e["result"]).startswith("Error")
    ]
    return {
        "answer": answer,
        # ponytail: no separate recommendation-extraction step exists yet;
        # reuses answer until the orchestrator prompt is taught to split them.
        "recommendation": answer,
        "evidence": evidence,
        "sources": sources,
        # ponytail: hazards/geofences/maps/charts/conflicts need dedicated
        # detection logic (hazard pipeline, geofence intersection, conflict
        # detection) that doesn't exist yet. Left empty rather than faked.
        "hazards": [],
        "geofences": [],
        "maps": [],
        "charts": [],
        "limitations": limitations,
        "conflicts": [],
        "freshness": {
            "generated_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        },
        "language": lang,
    }

# apikey = os.getenv("GROQ_API_KEY")

llm = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0,
    max_tokens=None,
    reasoning_format="parsed",
    timeout=None,
    max_retries=2,
)

SYSTEM_PROMPT = ORCHESTRATOR_SYSTEM_PROMPT


import json


async def call_orchestrator(user_data: ChatRequest):
    # available_tools will be passed if orchestrator has sub-agents
    from services.internal_tools.execute_meteorology_agent import call_meteorology_agent
    from services.internal_tools.execute_spatial_agent import call_spatial_agent

    available_tools = {
        "call_meteorology_agent": call_meteorology_agent,
        "call_spatial_agent": call_spatial_agent,
    }

    # Shared across the orchestrator and every sub-agent it calls; each real
    # tool call appends a record here, which becomes the "evidence" field of
    # the final structured response.
    evidence: list = []

    # Inject spatial context directly into the prompt so agents inherently know where the user is
    enriched_prompt = f"{user_data.prompt}\n[Context: User is currently located at Latitude {user_data.lat}, Longitude {user_data.long}]"

    async for chunk in call_agent(
        llm,
        enriched_prompt,
        user_data.role,
        SYSTEM_PROMPT,
        available_tools=available_tools,
        agent_name="orchestrator",
        evidence=evidence,
    ):
        print("From orchestrator")

        # Translate the final answer if it's a final response
        if '"type": "final"' in chunk:
            try:
                # the chunk looks like: data: {"type": "final", "content": "The actual answer"}\n\n
                chunk_data = json.loads(chunk.replace("data: ", "").strip())
                final_content = chunk_data.get("content", "")

                # Translate
                if user_data.lang and user_data.lang.lower() not in [
                    "english",
                    "en",
                    "en-in",
                ]:
                    try:
                        from sarvamai import SarvamAI
                        import asyncio

                        client = SarvamAI(
                            api_subscription_key=os.getenv("SARVAM_API_KEY")
                        )

                        def translate_text():
                            return client.text.translate(
                                input=final_content,
                                source_language_code="en-IN",
                                target_language_code=user_data.lang,
                            )

                        response = await asyncio.to_thread(translate_text)
                        final_content = response.translated_text
                    except Exception as e:
                        print("Sarvam translation error:", e)
                        translate_prompt = f"Translate the following text to {user_data.lang}. Maintain the tone and provide ONLY the translation, no conversational filler:\n\n{final_content}"
                        translated = await llm.ainvoke(
                            [HumanMessage(content=translate_prompt)]
                        )
                        final_content = translated.content

                structured_content = _build_structured_response(
                    final_content, evidence, user_data.lang
                )
                translated_chunk = f'data: {{"type": "final", "name": "orchestrator", "content": {json.dumps(structured_content, ensure_ascii=False)}}}\n\n'
                yield translated_chunk
            except Exception as e:
                print("Translation error:", e)
                yield chunk
        else:
            yield chunk
