from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict


class AgentMessageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    run_id: str
    from_agent: str
    to_agent: str
    event: str
    payload: Dict[str, Any] = {}
    status: str
    timestamp: datetime


class AgentRunRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    run_id: str
    trigger_event: str
    status: str
    started_at: datetime
    messages: List[AgentMessageRead] = []


class TriggerEventRequest(BaseModel):
    event: str
    payload: Dict[str, Any] = {}


class MentorMessageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    role: str
    content: str
    created_at: datetime


class MentorConversationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    created_at: datetime
    messages: List[MentorMessageRead] = []


class MentorChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None
