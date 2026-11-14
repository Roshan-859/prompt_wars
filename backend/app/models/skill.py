from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base import Base


class SkillCategory(Base):
    __tablename__ = "skill_categories"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(100), nullable=True)

    skills = relationship("Skill", back_populates="category")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    category_id = Column(Integer, ForeignKey("skill_categories.id"), nullable=True)
    skill_type = Column(String(50), default="technical")  # technical | soft
    icon = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    category = relationship("SkillCategory", back_populates="skills")
    user_skills = relationship("UserSkill", back_populates="skill")
    career_skills = relationship("CareerSkill", back_populates="skill")
    prerequisites = relationship(
        "SkillPrerequisite",
        foreign_keys="SkillPrerequisite.skill_id",
        back_populates="skill",
    )
    is_prerequisite_for = relationship(
        "SkillPrerequisite",
        foreign_keys="SkillPrerequisite.prerequisite_id",
        back_populates="prerequisite",
    )
    resource_skills = relationship("ResourceSkill", back_populates="skill")


class SkillPrerequisite(Base):
    __tablename__ = "skill_prerequisites"

    id = Column(Integer, primary_key=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    prerequisite_id = Column(Integer, ForeignKey("skills.id"), nullable=False)

    skill = relationship("Skill", foreign_keys=[skill_id], back_populates="prerequisites")
    prerequisite = relationship(
        "Skill", foreign_keys=[prerequisite_id], back_populates="is_prerequisite_for"
    )


class UserSkill(Base):
    __tablename__ = "user_skills"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    proficiency = Column(Integer, default=0)  # 0-100
    level = Column(String(50), default="beginner")  # beginner | intermediate | strong
    source = Column(String(100), default="manual")  # manual | assessment | import
    notes = Column(Text, nullable=True)
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    user = relationship("User", back_populates="user_skills")
    skill = relationship("Skill", back_populates="user_skills")
