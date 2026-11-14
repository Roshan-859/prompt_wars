from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=True)
    difficulty = Column(String(50), default="intermediate")
    time_limit_minutes = Column(Integer, default=30)
    passing_score = Column(Float, default=70.0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    skill = relationship("Skill")
    questions = relationship(
        "AssessmentQuestion", back_populates="assessment", cascade="all, delete-orphan"
    )
    attempts = relationship("AssessmentAttempt", back_populates="assessment")


class AssessmentQuestion(Base):
    __tablename__ = "assessment_questions"

    id = Column(Integer, primary_key=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    question_type = Column(String(50), default="mcq")  # mcq | true_false | short_answer
    options = Column(JSON, default=list)
    correct_answer = Column(String(500), nullable=False)
    explanation = Column(Text, nullable=True)
    points = Column(Float, default=1.0)
    order = Column(Integer, default=0)
    topic_tags = Column(JSON, default=list)

    assessment = relationship("Assessment", back_populates="questions")


class AssessmentAttempt(Base):
    __tablename__ = "assessment_attempts"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    score = Column(Float, nullable=True)
    max_score = Column(Float, nullable=True)
    percentage = Column(Float, nullable=True)
    answers = Column(JSON, default=dict)
    weak_topics = Column(JSON, default=list)
    status = Column(String(50), default="in_progress")  # in_progress | completed | abandoned
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="assessment_attempts")
    assessment = relationship("Assessment", back_populates="attempts")
