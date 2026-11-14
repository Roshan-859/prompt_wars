from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    bio = Column(Text, nullable=True)
    location = Column(String(255), nullable=True)
    education_level = Column(String(100), nullable=True)
    institution = Column(String(255), nullable=True)
    graduation_year = Column(Integer, nullable=True)
    target_career_id = Column(Integer, ForeignKey("careers.id"), nullable=True)
    linkedin_url = Column(String(500), nullable=True)
    github_url = Column(String(500), nullable=True)
    portfolio_url = Column(String(500), nullable=True)
    certifications = Column(JSON, default=list)
    completed_projects = Column(JSON, default=list)
    preferred_learning_style = Column(String(100), nullable=True)
    weekly_study_hours = Column(Integer, default=10)
    onboarding_completed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="profile")
    target_career = relationship("Career")
