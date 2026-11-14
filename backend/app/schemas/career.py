from typing import List, Optional

from pydantic import BaseModel, ConfigDict

from app.schemas.skill import SkillGapItem


class CareerRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = None
    category: Optional[str] = None
    avg_salary: Optional[str] = None
    demand_level: str


class CareerCompatibility(BaseModel):
    career: CareerRead
    readiness_score: float
    matched_skills: int
    total_required: int
    missing_skills: List[SkillGapItem]
    weak_skills: List[SkillGapItem]
    strong_skills: List[SkillGapItem]
