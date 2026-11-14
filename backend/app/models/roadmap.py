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


class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    career_id = Column(Integer, ForeignKey("careers.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(50), default="active")
    total_duration_weeks = Column(Integer, default=0)
    completion_percentage = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="roadmaps")
    career = relationship("Career", back_populates="roadmaps")
    phases = relationship(
        "RoadmapPhase",
        back_populates="roadmap",
        cascade="all, delete-orphan",
        order_by="RoadmapPhase.order",
    )


class RoadmapPhase(Base):
    __tablename__ = "roadmap_phases"

    id = Column(Integer, primary_key=True)
    roadmap_id = Column(Integer, ForeignKey("roadmaps.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    order = Column(Integer, nullable=False)
    duration_weeks = Column(Integer, default=4)
    status = Column(String(50), default="pending")  # pending | active | completed
    objectives = Column(JSON, default=list)

    roadmap = relationship("Roadmap", back_populates="phases")
    modules = relationship(
        "RoadmapModule",
        back_populates="phase",
        cascade="all, delete-orphan",
        order_by="RoadmapModule.order",
    )


class RoadmapModule(Base):
    __tablename__ = "roadmap_modules"

    id = Column(Integer, primary_key=True)
    phase_id = Column(Integer, ForeignKey("roadmap_phases.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    order = Column(Integer, nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=True)
    resource_id = Column(Integer, ForeignKey("resources.id"), nullable=True)
    duration_hours = Column(Integer, default=4)
    status = Column(String(50), default="pending")
    completed_at = Column(DateTime(timezone=True), nullable=True)

    phase = relationship("RoadmapPhase", back_populates="modules")
    skill = relationship("Skill")
    resource = relationship("Resource")
