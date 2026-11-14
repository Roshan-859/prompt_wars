from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.models.skill import UserSkill, Skill
from app.models.career import CareerSkill
from app.schemas.skill import SkillGapItem

def calculate_skill_gap(db: Session, user_id: int, career_id: int) -> List[SkillGapItem]:
    career_skills = db.query(CareerSkill).filter(CareerSkill.career_id == career_id).all()
    user_skills = db.query(UserSkill).filter(UserSkill.user_id == user_id).all()
    user_skill_map = {us.skill_id: us for us in user_skills}

    gaps = []
    for cs in career_skills:
        skill = db.query(Skill).get(cs.skill_id)
        if not skill:
            continue
        us = user_skill_map.get(cs.skill_id)
        user_prof = us.proficiency if us else 0
        gap = max(0, cs.min_proficiency - user_prof)

        status = "missing"
        if us:
            if us.proficiency >= 75:
                status = "strong"
            elif us.proficiency >= 50:
                status = "intermediate"
            elif us.proficiency > 0:
                status = "beginner"

        gaps.append(
            SkillGapItem(
                skill_id=skill.id,
                skill_name=skill.name,
                skill_slug=skill.slug,
                required_proficiency=cs.min_proficiency,
                user_proficiency=user_prof,
                gap=gap,
                importance=cs.importance,
                demand=cs.demand,
                status=status
            )
        )
    return sorted(gaps, key=lambda x: (-x.importance, x.gap))

def calculate_readiness_score(db: Session, user_id: int, career_id: int) -> float:
    career_skills = db.query(CareerSkill).filter(CareerSkill.career_id == career_id).all()
    if not career_skills:
        return 0.0
    user_skills = db.query(UserSkill).filter(UserSkill.user_id == user_id).all()
    user_skill_map = {us.skill_id: us for us in user_skills}

    total_weight = sum(cs.importance for cs in career_skills)
    matched_weight = 0.0

    for cs in career_skills:
        us = user_skill_map.get(cs.skill_id)
        if us:
            ratio = min(1.0, us.proficiency / max(1, cs.min_proficiency))
            matched_weight += ratio * cs.importance

    return round((matched_weight / total_weight) * 100, 1) if total_weight > 0 else 0.0

