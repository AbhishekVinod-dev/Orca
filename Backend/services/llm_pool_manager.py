import os
import time
import random
import logging
from typing import List, Dict, Optional, Any
from dotenv import load_dotenv
from langchain_groq import ChatGroq

try:
    from langchain_openai import ChatOpenAI
except ImportError:
    try:
        from langchain_community.chat_models import ChatOpenAI
    except ImportError:
        ChatOpenAI = None

load_dotenv()
logger = logging.getLogger("orca.llm_pool")


class KeyState:
    def __init__(self, key: str, provider: str):
        self.key = key
        self.provider = provider
        self.total_calls = 0
        self.total_errors = 0
        self.last_used = 0.0
        self.cooldown_until = 0.0

    def is_available(self) -> bool:
        return time.time() >= self.cooldown_until

    def mark_success(self):
        self.total_calls += 1
        self.last_used = time.time()

    def mark_rate_limited(self, backoff_seconds: float = 60.0):
        self.total_errors += 1
        self.cooldown_until = time.time() + backoff_seconds
        logger.warning(
            f"Key ending in ...{self.key[-6:] if len(self.key) > 6 else 'xxx'} ({self.provider}) rate-limited. Cooldown for {backoff_seconds}s"
        )


class ProviderKeyPool:
    def __init__(self, provider: str, keys: List[str]):
        self.provider = provider
        self.keys = [KeyState(k.strip(), provider) for k in keys if k.strip()]
        self._current_index = 0

    def get_next_available_key(self) -> Optional[str]:
        if not self.keys:
            return None

        now = time.time()
        start_idx = self._current_index

        for i in range(len(self.keys)):
            idx = (start_idx + i) % len(self.keys)
            key_state = self.keys[idx]
            if key_state.is_available():
                self._current_index = (idx + 1) % len(self.keys)
                return key_state.key

        # If all keys in pool are on cooldown, pick key with shortest remaining cooldown
        shortest_state = min(self.keys, key=lambda k: k.cooldown_until)
        logger.warning(
            f"All keys in {self.provider} pool on cooldown. Re-using shortest cooldown key."
        )
        return shortest_state.key

    def report_error(self, key_str: str, status_code: int = 429):
        for k in self.keys:
            if k.key == key_str:
                k.mark_rate_limited(backoff_seconds=60.0 if status_code == 429 else 30.0)
                break


class LLMPoolManager:
    """
    Multi-Provider LLM Key Pool & Rate-Limit Manager.
    Manages API key pools for Groq, NVIDIA NIM, OpenAI, and OpenRouter.
    """

    def __init__(self):
        self.pools: Dict[str, ProviderKeyPool] = {}
        self._initialize_pools()

    def _initialize_pools(self):
        # 1. Groq Keys
        groq_env = os.getenv("GROQ_API_KEYS", os.getenv("GROQ_API_KEY", ""))
        groq_keys = [k for k in groq_env.split(",") if k.strip()]
        if groq_keys:
            self.pools["groq"] = ProviderKeyPool("groq", groq_keys)

        # 2. NVIDIA NIM Keys
        nvidia_env = os.getenv("NVIDIA_API_KEYS", os.getenv("NVIDIA_API_KEY", ""))
        nvidia_keys = [k for k in nvidia_env.split(",") if k.strip()]
        if nvidia_keys:
            self.pools["nvidia"] = ProviderKeyPool("nvidia", nvidia_keys)

        # 3. OpenRouter Keys
        openrouter_env = os.getenv("OPENROUTER_API_KEYS", os.getenv("OPENROUTER_API_KEY", ""))
        openrouter_keys = [k for k in openrouter_env.split(",") if k.strip()]
        if openrouter_keys:
            self.pools["openrouter"] = ProviderKeyPool("openrouter", openrouter_keys)

        # 4. OpenAI Keys
        openai_env = os.getenv("OPENAI_API_KEYS", os.getenv("OPENAI_API_KEY", ""))
        openai_keys = [k for k in openai_env.split(",") if k.strip()]
        if openai_keys:
            self.pools["openai"] = ProviderKeyPool("openai", openai_keys)

    def get_llm(
        self,
        agent_role: str = "general",
        preferred_provider: Optional[str] = None,
        model_tier: str = "fast",
        temperature: float = 0.0,
    ) -> Any:
        """
        Returns a configured LLM client using an active key from the pool.
        Model Tier:
          - 'fast': Low-latency model (e.g. Groq llama-3.3-70b-versatile)
          - 'heavy': Deep reasoning model (e.g. Groq openai/gpt-oss-120b or NVIDIA NIM)
        """
        # Determine provider sequence
        provider_order = []
        if preferred_provider and preferred_provider in self.pools:
            provider_order.append(preferred_provider)

        # Agent role mapping defaults
        if agent_role in ["planner", "router", "intent_classifier"]:
            provider_order.extend(["groq", "openrouter", "openai"])
        elif agent_role in ["evidence_synthesizer", "risk_agent", "analyst"]:
            provider_order.extend(["groq", "nvidia", "openai", "openrouter"])
        else:
            provider_order.extend(["groq", "nvidia", "openrouter", "openai"])

        # Deduplicate while preserving order
        seen = set()
        dedup_providers = [p for p in provider_order if not (p in seen or seen.add(p))]

        for provider in dedup_providers:
            if provider not in self.pools:
                continue

            api_key = self.pools[provider].get_next_available_key()
            if not api_key:
                continue

            try:
                if provider == "groq":
                    model_name = (
                        "llama-3.3-70b-versatile"
                        if model_tier == "fast"
                        else "openai/gpt-oss-120b"
                    )
                    return ChatGroq(
                        model=model_name,
                        groq_api_key=api_key,
                        temperature=temperature,
                        max_retries=2,
                        reasoning_format="parsed" if "120b" in model_name else "raw",
                    )
                elif provider == "nvidia" and ChatOpenAI is not None:
                    model_name = "meta/llama-3.3-70b-instruct"
                    return ChatOpenAI(
                        model=model_name,
                        openai_api_key=api_key,
                        openai_api_base="https://integrate.api.nvidia.com/v1",
                        temperature=temperature,
                        max_retries=2,
                    )
                elif provider == "openrouter" and ChatOpenAI is not None:
                    model_name = "meta-llama/llama-3.3-70b-instruct"
                    return ChatOpenAI(
                        model=model_name,
                        openai_api_key=api_key,
                        openai_api_base="https://openrouter.ai/api/v1",
                        temperature=temperature,
                        max_retries=2,
                    )
                elif provider == "openai" and ChatOpenAI is not None:
                    model_name = "gpt-4o-mini" if model_tier == "fast" else "gpt-4o"
                    return ChatOpenAI(
                        model=model_name,
                        openai_api_key=api_key,
                        temperature=temperature,
                        max_retries=2,
                    )
            except Exception as e:
                logger.error(f"Failed to instantiate LLM for provider {provider}: {e}")
                self.pools[provider].report_error(api_key, status_code=500)

        # Fallback to default Groq instance if pool lookup fails
        logger.warning("Fallback to default ChatGroq instance")
        return ChatGroq(
            model="openai/gpt-oss-120b" if model_tier == "heavy" else "llama-3.3-70b-versatile",
            temperature=temperature,
            max_retries=2,
        )

    def report_rate_limit(self, provider: str, api_key: str):
        if provider in self.pools:
            self.pools[provider].report_error(api_key, status_code=429)


# Global Singleton LLM Pool Instance
llm_pool_manager = LLMPoolManager()
