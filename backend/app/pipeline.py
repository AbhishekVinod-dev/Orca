import time

from app.groq_client import classify_intent, generate_advisory
from app.schemas import AgentStep, ChatResponse

SEVERITY_SCORE = {"critical": 100, "high": 70, "moderate": 40, "low": 15}


def data_agent(intent: str) -> list[dict]:
    # Demo alerts must never be represented as live operational warnings.
    # Until an official warning feed is available, safety advice has no alert input.
    return []


def risk_agent(alerts: list[dict]) -> int:
    if not alerts:
        return 0
    return max(SEVERITY_SCORE[a["severity"]] for a in alerts)


def stream_chat_pipeline(query: str, language: str = "en"):
    """Yields ('step', AgentStep) as each stage completes, then a single
    ('final', ChatResponse) once the pipeline is done. Real elapsed time per
    stage -- the caller forwards each step to the client as soon as it
    arrives, rather than waiting for the whole pipeline."""
    steps: list[AgentStep] = []

    start = time.perf_counter()
    intent = classify_intent(query)
    step = AgentStep(
        agent="Planner",
        status="done",
        action="Intent classification",
        detail=f"Detected: {intent}",
        duration_ms=int((time.perf_counter() - start) * 1000),
        sources=[],
    )
    steps.append(step)
    yield ("step", step)

    start = time.perf_counter()
    alerts = data_agent(intent)
    step = AgentStep(
        agent="DataAgent",
        status="done",
        action="Checking warning availability",
        detail="No live official warning feed is configured; demo alerts were excluded",
        duration_ms=int((time.perf_counter() - start) * 1000),
        sources=[],
    )
    steps.append(step)
    yield ("step", step)

    start = time.perf_counter()
    risk_score = risk_agent(alerts)
    step = AgentStep(
        agent="RiskAgent",
        status="done",
        action="Risk scoring",
        detail=f"Composite risk score: {risk_score}",
        duration_ms=int((time.perf_counter() - start) * 1000),
        sources=[],
    )
    steps.append(step)
    yield ("step", step)

    start = time.perf_counter()
    advisory = generate_advisory(query, intent, risk_score, language, warning_data_available=bool(alerts))
    response_text = advisory
    if alerts:
        warnings_block = "\n\n".join(
            f"**{a['title']}** ({a['id']}, source: {a['source']})\n{a['description']}"
            for a in alerts
        )
        response_text = f"{advisory}\n\n---\n\n**Official Warnings:**\n\n{warnings_block}"
    step = AgentStep(
        agent="ResponseAgent",
        status="done",
        action="Generating response",
        detail="Generated an advisory without unsourced warning data",
        duration_ms=int((time.perf_counter() - start) * 1000),
        sources=[],
    )
    steps.append(step)
    yield ("step", step)

    final = ChatResponse(
        id=f"chat-{int(time.time() * 1000)}",
        query_patterns=[],
        response=response_text,
        agent_trace=steps,
        related_data={"alerts": [a["id"] for a in alerts]} if alerts else None,
    )
    yield ("final", final)
