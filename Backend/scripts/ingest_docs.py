import os
import sys
import requests
import logging

sys.path.insert(0, r"c:\Users\ASUS\Documents\GitHub\Orca")
from services.vector_store import pinecone_rag_store

logger = logging.getLogger("orca.ingest")


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = " ".join(words[i : i + chunk_size])
        if chunk:
            chunks.append(chunk)
    return chunks


def ingest_documentation():
    print("--- ORCA PINECONE DOCUMENT INGESTION SCRIPT ---")

    if not pinecone_rag_store.is_configured():
        print("⚠️ PINECONE_API_KEY or PINECONE_HOST not set in environment.")
        print("Set PINECONE_API_KEY, PINECONE_HOST, and PINECONE_INDEX_NAME in .env to enable live vector index.")
        return

    # ONLY import product domain knowledge specifications, NOT developer/codebase docs
    doc_files = [
        r"c:\Users\ASUS\Documents\GitHub\Orca\ORCA_Marine_Intelligence_Platform_Specification.md",
    ]

    total_chunks = 0
    for file_path in doc_files:
        filename = os.path.basename(file_path)
        # Explicit guard: do not import internal developer/codebase docs to the product index
        if filename in ["CODE_REVIEW_GRAPH.md", "FRONTEND_AND_API_SPECIFICATION.md", "README.md"]:
            print(f"Skipping developer codebase doc: {filename}")
            continue

        if os.path.exists(file_path):
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            chunks = chunk_text(content)
            total_chunks += len(chunks)
            print(f"Parsed product spec {filename}: {len(chunks)} text chunks.")

    print(f"Total chunks ready for Pinecone upsert: {total_chunks}")
    print("Ingestion configuration valid.")


if __name__ == "__main__":
    ingest_documentation()
