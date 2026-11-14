from abc import ABC, abstractmethod
from typing import Any, Dict, List


class LLMProvider(ABC):
    @abstractmethod
    def chat(self, messages: List[Dict[str, str]], **kwargs) -> str:
        """Send a chat completion request and return the response text."""

    @abstractmethod
    def is_demo(self) -> bool:
        """Return True if this provider is a demo/mock implementation."""
