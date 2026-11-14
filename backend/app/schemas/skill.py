from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class SkillRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    description: Optional[str] = None
    skill_type: str
    icon: Optional[str] = None
    category_id: Optional[int] = None


class UserSkillCreate(BaseModel):
    skill_id: int
    proficiency: int = 50
    level: str = "beginner"
    source: str = "manual"
    notes: Optional[str] = None


class UserSkillUpdate(BaseModel):
    proficiency: Optional[int] = None
    level: Optional[str] = None
    notes: Optional[str] = None


class UserSkillRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    skill_id: int
    proficiency: int
    level: str
    source: str
    notes: Optional[str] = None
    updated_at: datetime
    skill: SkillRead


class SkillGapItem(BaseModel):
    skill_id: int
    skill_name: str
    skill_slug: str
    required_proficiency: int
    user_proficiency: int
    gap: int
    importance: float
    demand: str
    status: str  # strong | intermediate | beginner | missing
