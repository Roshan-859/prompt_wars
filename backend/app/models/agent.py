from sqlalchemy import (
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


class AgentRun(Base):
    __tablename__ = "agent_runs"

    id = Column(Integer, primary_key=True)
    run_id = Column(String(100), unique=True, nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    trigger_event = Column(String(100), nullable=False)
    trigger_payload = Column(JSON, default=dict)
    status = Column(String(50), default="running")  # running | completed | failed
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    messages = relationship(
        "AgentMessage", back_populates="run", cascade="all, delete-orphan"
    )


class AgentMessage(Base):
    __tablename__ = "agent_messages"

    id = Column(Integer, primary_key=True)
    run_id_fk = Column(Integer, ForeignKey("agent_runs.id"), nullable=False)
    run_id = Column(String(100), nullable=False, index=True)
    from_agent = Column(String(100), nullable=False)
    to_agent = Column(String(100), nullable=False)
    event = Column(String(100), nullable=False)
    payload = Column(JSON, default=dict)
    status = Column(String(50), default="delivered")
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    run = relationship("AgentRun", back_populates="messages")


class MentorConversation(Base):
    __tablename__ = "mentor_conversations"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), default="New Conversation")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="mentor_conversations")
    messages = relationship(
        "MentorMessage", back_populates="conversation", cascade="all, delete-orphan"
    )


class MentorMessage(Base):
    __tablename__ = "mentor_messages"

    id = Column(Integer, primary_key=True)
    conversation_id = Column(Integer, ForeignKey("mentor_conversations.id"), nullable=False)
    role = Column(String(50), nullable=False)  # user | assistant
    content = Column(Text, nullable=False)
    metadata = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    conversation = relationship("MentorConversation", back_populates="messages")


class LearningActivity(Base):
    __tablename__ = "learning_activities"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(DateTime(timezone=True), nullable=False)
    hours_studied = Column(Float, default=0.0)
    modules_completed = Column(Integer, default=0)
    skills_practiced = Column(JSON, default=list)
    streak_day = Column(Integer, default=0)

    user = relationship("User", back_populates="learning_activities")
