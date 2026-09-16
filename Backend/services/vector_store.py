import os
import logging
import requests
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger("orca.vector_store")


class PineconeRAGStore:
    """
    Pinecone Vector Database Store & Retrieval Service for Standard RAG.
    Supports Pinecone REST API / SDK for indexing static marine regulations,
    ISRO documentation, and Argo profile dataset summaries.
    """

    def __init__(self):
        self.api_key = os.getenv("PINECONE_API_KEY", "")
        self.environment = os.getenv("PINECONE_ENVIRONMENT", "us-east-1")
        self.index_name = os.getenv("PINECONE_INDEX_NAME", "orca-maritime-rag")
        self.host = os.getenv("PINECONE_HOST", "")  # e.g. https://orca-maritime-rag-xxx.svc.pinecone.io

    def is_configured(self) -> bool:
        return bool(self.api_key and (self.host or self.index_name))

    def similarity_search(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """
        Query Pinecone vector database for relevant documentation chunks.
        Returns list of matching document snippets with metadata.
        """
    def similarity_search(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """
        Query Pinecone vector database for relevant documentation chunks.
        Returns list of matching document snippets with metadata.
        """
        if not self.is_configured():
            logger.warning("Pinecone API key or Host not configured. Returning empty RAG results.")
            return []

        try:
            headers = {
                "Api-Key": self.api_key,
                "Content-Type": "application/json"
            }
            # Pinecone query endpoint
            query_url = f"{self.host}/query" if self.host.startswith("http") else f"https://{self.index_name}.svc.{self.environment}.pinecone.io/query"
            
            payload = {
                "topK": top_k,
                "includeMetadata": True,
                "includeValues": False,
                "vector": [0.1] * 1536  # Placeholder vector if no embedding model passed
            }
            res = requests.post(query_url, json=payload, headers=headers, timeout=5)
            if res.status_code == 200:
                matches = res.json().get("matches", [])
                return [
                    {
                        "content": m.get("metadata", {}).get("text", ""),
                        "source": m.get("metadata", {}).get("source", "ISRO Docs"),
                        "score": m.get("score", 0.0)
                    }
                    for m in matches
                ]
            else:
                logger.error(f"Pinecone query failed HTTP {res.status_code}: {res.text}")
                return []
        except Exception as e:
            logger.error(f"Pinecone RAG search error: {e}")
            return []


# Global Singleton Pinecone RAG Store Instance
pinecone_rag_store = PineconeRAGStore()

