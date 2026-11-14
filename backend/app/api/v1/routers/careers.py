from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.career import Career
from app.schemas.career import CareerRead
from app.services.skill_gap import calculate_skill_gap, calculate_readiness_score

router = APIRouter(prefix="/careers", tags=["careers"])

@router.get("/", response_model=List[CareerRead])
def list_careers(db: Session = Depends(get_db)):
    return db.query(Career).filter(Career.is_active == True).all()

@router.get("/{career_id}", response_model=CareerRead)
def get_career(career_id: int, db: Session = Depends(get_db)):
    return db.query(Career).get(career_id)

@router.get("/{career_id}/compatibility")
def get_compatibility(career_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    gaps = calculate_skill_gap(db, current_user.id, career_id)
    readiness = calculate_readiness_score(db, current_user.id, career_id)
    strong = [g for g in gaps if g.status == "strong"]
    intermediate = [g for g in gaps if g.status == "intermediate"]
    missing = [g for g in gaps if g.status == "missing"]
    weak = [g for g in gaps if g.status == "beginner"]

    return {
        "career_id": career_id,
        "readiness_score": readiness,
        "total_skills": len(gaps),
        "strong_count": len(strong),
        "intermediate_count": len(intermediate),
        "missing_count": len(missing),
        "weak_count": len(weak),
        "gaps": [g.model_dump() for g in gaps],
    }

