from typing import List, Optional

from pydantic import BaseModel, ConfigDict


class ResourceRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: Optional[str] = None
    url: Optional[str] = None
    resource_type: str
    platform: Optional[str] = None
    difficulty: str
    duration_hours: Optional[float] = None
    is_free: bool
    rating: float
    thumbnail_url: Optional[str] = None


class UserResourceProgressRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    resource_id: int
    status: str
    progress_percent: float


class UserResourceProgressUpdate(BaseModel):
    status: str
    progress_percent: float = 0.0
