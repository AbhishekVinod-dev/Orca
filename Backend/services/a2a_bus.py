import asyncio
import logging
import uuid
from typing import Dict, Any, Callable, Awaitable, List, Optional
from schema.a2a_schema import A2AEnvelope, A2AResponse

logger = logging.getLogger("orca.a2a_bus")


class A2ABus:
    """
    Agent-to-Agent (A2A) Messaging & Context Bus.
    Enables structured inter-agent communication, parallel fan-out tool requests,
    and trace tracking across the multi-agent network.
    """

    def __init__(self):
        self._handlers: Dict[str, Callable[[A2AEnvelope], Awaitable[A2AResponse]]] = {}
        self._trace_logs: Dict[str, List[A2AEnvelope]] = {}

    def register_agent(
        self, agent_name: str, handler: Callable[[A2AEnvelope], Awaitable[A2AResponse]]
    ):
        """Register an agent's message handler function."""
        self._handlers[agent_name] = handler
        logger.info(f"Registered A2A agent handler: {agent_name}")

    async def send(self, envelope: A2AEnvelope) -> A2AResponse:
        """Send a single A2A envelope to a target agent."""
        trace_id = envelope.trace_id or str(uuid.uuid4())
        envelope.trace_id = trace_id

        if trace_id not in self._trace_logs:
            self._trace_logs[trace_id] = []
        self._trace_logs[trace_id].append(envelope)

        target = envelope.target_agent
        if target not in self._handlers:
            error_msg = f"A2A Target agent '{target}' is not registered."
            logger.error(error_msg)
            return A2AResponse(
                trace_id=trace_id,
                sender_agent=target,
                status="error",
                error_message=error_msg,
            )

        logger.info(f"A2A [{envelope.sender_agent} -> {target}] Intent: {envelope.intent}")
        try:
            handler = self._handlers[target]
            response = await handler(envelope)
            return response
        except Exception as e:
            logger.exception(f"A2A handler error for target agent '{target}': {e}")
            return A2AResponse(
                trace_id=trace_id,
                sender_agent=target,
                status="error",
                error_message=str(e),
            )

    async def fan_out(self, envelopes: List[A2AEnvelope]) -> List[A2AResponse]:
        """
        Execute multiple A2A envelopes in parallel across different domain agents.
        Uses asyncio.gather for minimum latency.
        """
        tasks = [self.send(env) for env in envelopes]
        responses = await asyncio.gather(*tasks, return_exceptions=True)

        final_responses = []
        for i, res in enumerate(responses):
            if isinstance(res, Exception):
                target = envelopes[i].target_agent
                final_responses.append(
                    A2AResponse(
                        trace_id=envelopes[i].trace_id,
                        sender_agent=target,
                        status="error",
                        error_message=str(res),
                    )
                )
            else:
                final_responses.append(res)

        return final_responses

    def get_trace_history(self, trace_id: str) -> List[A2AEnvelope]:
        return self._trace_logs.get(trace_id, [])


# Global Singleton A2A Bus Instance
a2a_bus = A2ABus()
