from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class RoadmapModuleRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: Optional[str] = None
    order: int
    duration_hours: int
    status: str
    skill_id: Optional[int] = None
    resource_id: Optional[int] = None
    completed_at: Optional[datetime] = None


class RoadmapModuleUpdate(BaseModel):
    status: str


class RoadmapPhaseRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: Optional[str] = None
    order: int
    duration_weeks: int
    status: str
    objectives: List[str] = []
    modules: List[RoadmapModuleRead] = []


class RoadmapRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    career_id: int
    title: str
    description: Optional[str] = None
    status: str
    total_duration_weeks: int
    completion_percentage: float
    created_at: datetime
    phases: List[RoadmapPhaseRead] = []
