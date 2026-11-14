from app.core.config import settings
from app.llm.base import LLMProvider
from app.llm.demo_client import DemoLLMProvider


def get_llm_provider() -> LLMProvider:
    """Return the configured LLM provider.

    Currently always returns DemoLLMProvider.  To add OpenAI support, replace
    the second branch with an OpenAIProvider instantiation.
    """
    if settings.DEMO_MODE or settings.LLM_PROVIDER == "demo" or not settings.OPENAI_API_KEY:
        return DemoLLMProvider()
    # Fallback — real provider can be wired here when available
    return DemoLLMProvider()
