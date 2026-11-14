from datetime import datetime
from typing import Any, List, Optional

from pydantic import BaseModel, ConfigDict


class ProfileUpdate(BaseModel):
    bio: Optional[str] = None
    location: Optional[str] = None
    education_level: Optional[str] = None
    institution: Optional[str] = None
    graduation_year: Optional[int] = None
    target_career_id: Optional[int] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    certifications: Optional[List[Any]] = None
    completed_projects: Optional[List[Any]] = None
    preferred_learning_style: Optional[str] = None
    weekly_study_hours: Optional[int] = None
    onboarding_completed: Optional[bool] = None


class ProfileRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    bio: Optional[str] = None
    location: Optional[str] = None
    education_level: Optional[str] = None
    institution: Optional[str] = None
    graduation_year: Optional[int] = None
    target_career_id: Optional[int] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    certifications: List[Any] = []
    completed_projects: List[Any] = []
    preferred_learning_style: Optional[str] = None
    weekly_study_hours: Optional[int] = None
    onboarding_completed: bool = False
    updated_at: Optional[datetime] = None
