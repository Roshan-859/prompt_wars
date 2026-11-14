from sqlalchemy import Boolean, Column, Float, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import relationship

from app.db.base import Base


class Career(Base):
    __tablename__ = "careers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(100), nullable=True)
    category = Column(String(100), nullable=True)
    avg_salary = Column(String(100), nullable=True)
    demand_level = Column(String(50), default="high")
    is_active = Column(Boolean, default=True)

    career_skills = relationship(
        "CareerSkill", back_populates="career", cascade="all, delete-orphan"
    )
    roadmaps = relationship("Roadmap", back_populates="career")


class CareerSkill(Base):
    __tablename__ = "career_skills"

    id = Column(Integer, primary_key=True)
    career_id = Column(Integer, ForeignKey("careers.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    importance = Column(Float, default=1.0)  # 0.0-1.0 weight
    demand = Column(String(50), default="required")  # required | preferred | optional
    min_proficiency = Column(Integer, default=60)  # required proficiency level

    career = relationship("Career", back_populates="career_skills")
    skill = relationship("Skill", back_populates="career_skills")
