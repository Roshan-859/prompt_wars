from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class AgentInput(BaseModel):
    run_id: str
    user_id: int
    event: str
    payload: Dict[str, Any] = {}
    context: Dict[str, Any] = {}


class AgentOutput(BaseModel):
    run_id: str
    agent_name: str
    success: bool
    result: Dict[str, Any] = {}
    messages: List[Dict[str, Any]] = []
    next_agents: List[str] = []
    error: Optional[str] = None
