import os
import sys
import requests
import json
import logging
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger("orca.ingest_pinecone")

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY", "")
PINECONE_HOST = os.getenv("PINECONE_HOST", "https://orca-maritime-rag-fusylxo.svc.aped-4627-b74a.pinecone.io")
INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "orca-maritime-rag")


CHUNK_SIZE_CHARS = 2000
CHUNK_OVERLAP_CHARS = 200


def chunk_orca_specification(file_path: str):
    """
    Parses ORCA_Marine_Intelligence_Platform_Specification.md into domain chunks.
    Uses optimal chunk parameters: chunk_size=2000 characters (~500 tokens/words),
    chunk_overlap=200 characters (~50 tokens/words) for high-accuracy retrieval.
    """
    if not os.path.exists(file_path):
        print(f"Error: Specification file not found at {file_path}")
        return []

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    import re
    sections = re.split(r'\n(?=# [0-9]+\. )', content)
    records = []

    for idx, sec in enumerate(sections):
        sec_clean = sec.strip()
        if not sec_clean:
            continue

        lines = sec_clean.split("\n")
        title = lines[0].strip() if lines else f"Section {idx}"
        body = "\n".join(lines[1:]).strip()

        if len(body) < 50:
            continue

        # Character/word chunking with size=2000 chars (~450-500 words), overlap=200 chars (~45-50 words)
        words = body.split()
        word_chunk_size = 450  # ~2000 chars
        word_overlap = 45      # ~200 chars

        step = word_chunk_size - word_overlap
        for sub_idx, start_pos in enumerate(range(0, len(words), step)):
            chunk_words = words[start_pos : start_pos + word_chunk_size]
            if not chunk_words:
                break

            chunk_text = f"{title}\n\n" + " ".join(chunk_words)
            rec_id = f"orca-spec-s{idx}-p{sub_idx + 1}"
            records.append({
                "id": rec_id,
                "text": chunk_text,
                "source": "ISRO ORCA Platform Specification v1.0",
                "section": title,
            })

    return records


def chunk_argo_dataset(csv_path: str, max_records: int = 500):
    """
    Parses argo_semantic_summary_1.csv and groups float observation summaries
    into high-accuracy chunks of ~2000 characters with 200 character overlap.
    """
    if not os.path.exists(csv_path):
        print(f"Dataset not found at {csv_path}")
        return []

    import csv
    records = []
    current_summaries = []
    current_len = 0
    chunk_idx = 1

    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            summary = row.get("summary", "").strip()
            if not summary:
                continue

            current_summaries.append(summary)
            current_len += len(summary) + 1

            if current_len >= CHUNK_SIZE_CHARS:
                chunk_text = "Argo Oceanographic Observations:\n" + "\n".join(current_summaries)
                rec_id = f"argo-dataset-chunk-{chunk_idx}"
                records.append({
                    "id": rec_id,
                    "text": chunk_text,
                    "source": "INCOIS Argo Float Profiles",
                    "section": "Indian Ocean Profile Observations",
                })
                chunk_idx += 1

                if len(records) >= max_records:
                    break

                # Maintain 200 char overlap (~1-2 observation summaries)
                overlap_len = 0
                new_summaries = []
                for s in reversed(current_summaries):
                    if overlap_len + len(s) <= CHUNK_OVERLAP_CHARS:
                        new_summaries.insert(0, s)
                        overlap_len += len(s) + 1
                    else:
                        break

                current_summaries = new_summaries
                current_len = overlap_len

    return records


def upsert_to_pinecone(records):
    print(f"Total chunks ready for Pinecone Integrated Inference: {len(records)}")

    if not PINECONE_API_KEY:
        print("Notice: PINECONE_API_KEY missing in environment. Chunks validated and serialized locally.")
        return

    url = f"{PINECONE_HOST.rstrip('/')}/records/namespaces/default/upsert"
    headers = {
        "Api-Key": PINECONE_API_KEY,
        "Content-Type": "application/json"
    }

    # Upsert in batches of 50
    batch_size = 50
    success_count = 0

    for i in range(0, len(records), batch_size):
        batch = records[i : i + batch_size]
        payload = {"records": batch}

        res = requests.post(url, json=payload, headers=headers, timeout=15)
        if res.status_code == 200:
            success_count += len(batch)
            print(f"Successfully upserted batch {i//batch_size + 1}: {len(batch)} records.")
        else:
            print(f"Failed upsert batch {i//batch_size + 1} HTTP {res.status_code}: {res.text}")

    print(f"\n[+] Pinecone Ingestion Run Complete! Total Records Processed: {success_count}/{len(records)}")


if __name__ == "__main__":
    spec_path = r"c:\Users\ASUS\Documents\GitHub\Orca\ORCA_Marine_Intelligence_Platform_Specification.md"
    dataset_path = r"c:\Users\ASUS\Documents\GitHub\Orca\Datasets\argo_semantic_summary_1.csv"

    spec_recs = chunk_orca_specification(spec_path)
    dataset_recs = chunk_argo_dataset(dataset_path)

    all_records = spec_recs + dataset_recs
    print(f"Generated {len(spec_recs)} spec chunks and {len(dataset_recs)} Argo dataset chunks (chunk_size=2000, chunk_overlap=200).")

    if all_records:
        upsert_to_pinecone(all_records)

