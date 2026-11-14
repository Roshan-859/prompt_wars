from sqlalchemy.orm import Session
from app.services.skill_gap import calculate_readiness_score, calculate_skill_gap
from app.models.profile import Profile
from app.models.career import Career
from typing import Dict, Any

def get_user_readiness(db: Session, user_id: int) -> Dict[str, Any]:
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile or not profile.target_career_id:
        return {
            "readiness_score": 0.0,
            "career_id": None,
            "career_name": None,
            "gaps": []
        }

    career = db.query(Career).get(profile.target_career_id)
    score = calculate_readiness_score(db, user_id, profile.target_career_id)
    gaps = calculate_skill_gap(db, user_id, profile.target_career_id)

    return {
        "readiness_score": score,
        "career_id": profile.target_career_id,
        "career_name": career.name if career else None,
        "gaps": [g.model_dump() for g in gaps],
    }

