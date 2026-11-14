from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    url = Column(String(1000), nullable=True)
    resource_type = Column(String(100), nullable=False)  # course | video | doc | exercise | project | challenge
    platform = Column(String(100), nullable=True)
    difficulty = Column(String(50), default="beginner")  # beginner | intermediate | advanced
    duration_hours = Column(Float, nullable=True)
    is_free = Column(Boolean, default=True)
    rating = Column(Float, default=4.5)
    thumbnail_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    resource_skills = relationship(
        "ResourceSkill", back_populates="resource", cascade="all, delete-orphan"
    )
    user_progress = relationship("UserResourceProgress", back_populates="resource")


class ResourceSkill(Base):
    __tablename__ = "resource_skills"

    id = Column(Integer, primary_key=True)
    resource_id = Column(Integer, ForeignKey("resources.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    relevance = Column(Float, default=1.0)

    resource = relationship("Resource", back_populates="resource_skills")
    skill = relationship("Skill", back_populates="resource_skills")


class UserResourceProgress(Base):
    __tablename__ = "user_resource_progress"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    resource_id = Column(Integer, ForeignKey("resources.id"), nullable=False)
    status = Column(String(50), default="not_started")  # not_started | in_progress | completed
    progress_percent = Column(Float, default=0.0)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="resource_progress")
    resource = relationship("Resource", back_populates="user_progress")
