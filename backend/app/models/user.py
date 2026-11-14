import enum

from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class UserRole(str, enum.Enum):
    student = "student"
    organization = "organization"
    admin = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="student", nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    avatar_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    profile = relationship(
        "Profile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )
    user_skills = relationship(
        "UserSkill", back_populates="user", cascade="all, delete-orphan"
    )
    roadmaps = relationship(
        "Roadmap", back_populates="user", cascade="all, delete-orphan"
    )
    assessment_attempts = relationship(
        "AssessmentAttempt", back_populates="user", cascade="all, delete-orphan"
    )
    mentor_conversations = relationship(
        "MentorConversation", back_populates="user", cascade="all, delete-orphan"
    )
    learning_activities = relationship(
        "LearningActivity", back_populates="user", cascade="all, delete-orphan"
    )
    resource_progress = relationship(
        "UserResourceProgress", back_populates="user", cascade="all, delete-orphan"
    )
