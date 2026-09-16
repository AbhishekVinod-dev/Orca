from typing import Dict, Any
import logging
from services.vector_store import pinecone_rag_store

logger = logging.getLogger("orca.rag_router")


class RAGRouter:
    """
    Standard RAG vs. Agentic RAG Router (ISRO Specification Section 30).
    Dynamically routes static regulatory/document queries to Pinecone Vector RAG
    and complex multi-source spatial-temporal queries to the Agentic A2A Network.
    """

    STATIC_KEYWORDS = [
        "regulation", "regulations", "rule", "rules", "law", "policy",
        "act", "documentation", "definition", "what is argo", "penalty",
        "jurisdiction", "license", "guideline", "guidelines"
    ]

    def route_query(self, prompt: str) -> Dict[str, Any]:
        prompt_lower = prompt.lower()

        # Check if query matches static regulatory patterns
        is_static = any(kw in prompt_lower for kw in self.STATIC_KEYWORDS) and not any(
            kw in prompt_lower for kw in ["today", "now", "current", "forecast", "safe to sail", "wave height"]
        )

        if is_static:
            logger.info("RAG Router: Selected STANDARD_RAG for static query")
            retrieved_docs = pinecone_rag_store.similarity_search(prompt, top_k=3)
            return {
                "route": "STANDARD_RAG",
                "use_agentic": False,
                "reason": "Static regulatory or documentation query detected.",
                "retrieved_docs": retrieved_docs,
            }
        else:
            logger.info("RAG Router: Selected AGENTIC_RAG for dynamic spatial-temporal query")
            return {
                "route": "AGENTIC_RAG",
                "use_agentic": True,
                "reason": "Dynamic spatial, meteorological, or multi-source reasoning required.",
                "retrieved_docs": [],
            }


# Global Singleton RAG Router Instance
rag_router = RAGRouter()
