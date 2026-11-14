import logging
from abc import ABC, abstractmethod
from datetime import datetime

from sqlalchemy.orm import Session

from app.agents.schemas import AgentInput, AgentOutput

logger = logging.getLogger(__name__)


class BaseAgent(ABC):
    name: str = "base_agent"
    description: str = ""

    def __init__(self, db: Session) -> None:
        self.db = db

    @abstractmethod
    def run(self, input: AgentInput) -> AgentOutput:
        """Execute agent logic and return structured output."""

    def _create_message(
        self,
        run_id: str,
        from_agent: str,
        to_agent: str,
        event: str,
        payload: dict,
    ) -> dict:
        return {
            "run_id": run_id,
            "from_agent": from_agent,
            "to_agent": to_agent,
            "event": event,
            "payload": payload,
            "status": "delivered",
            "timestamp": datetime.utcnow().isoformat(),
        }
