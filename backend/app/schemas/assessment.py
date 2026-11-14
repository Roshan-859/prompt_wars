from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict


class AssessmentQuestionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    question_text: str
    question_type: str
    options: List[Any] = []
    points: float
    order: int
    topic_tags: List[str] = []


class AssessmentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: Optional[str] = None
    skill_id: Optional[int] = None
    difficulty: str
    time_limit_minutes: int
    passing_score: float
    questions: List[AssessmentQuestionRead] = []


class AssessmentSubmit(BaseModel):
    answers: Dict[str, str]  # question_id -> answer


class AssessmentAttemptRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    assessment_id: int
    score: Optional[float] = None
    max_score: Optional[float] = None
    percentage: Optional[float] = None
    weak_topics: List[str] = []
    status: str
    started_at: datetime
    completed_at: Optional[datetime] = None
