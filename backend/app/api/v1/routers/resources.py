from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.resource import Resource, ResourceSkill, UserResourceProgress
from app.models.profile import Profile
from app.models.skill import UserSkill
from app.models.career import CareerSkill
from app.schemas.resource import ResourceRead, UserResourceProgressUpdate

router = APIRouter(prefix="/resources", tags=["resources"])

@router.get("/recommended", response_model=List[ResourceRead])
def get_recommended(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile or not profile.target_career_id:
        return db.query(Resource).filter(Resource.is_active == True).limit(10).all()

    career_skills = db.query(CareerSkill).filter(
        CareerSkill.career_id == profile.target_career_id
    ).order_by(CareerSkill.importance.desc()).limit(8).all()

    user_skills = db.query(UserSkill).filter(UserSkill.user_id == current_user.id).all()
    user_skill_map = {us.skill_id: us for us in user_skills}

    gap_skills = [
        cs.skill_id for cs in career_skills
        if not user_skill_map.get(cs.skill_id) or user_skill_map[cs.skill_id].proficiency < cs.min_proficiency
    ]

    if not gap_skills:
        return db.query(Resource).filter(Resource.is_active == True).limit(10).all()

    rs = db.query(ResourceSkill).filter(ResourceSkill.skill_id.in_(gap_skills)).all()
    resource_ids = list({r.resource_id for r in rs})[:10]
    return db.query(Resource).filter(Resource.id.in_(resource_ids), Resource.is_active == True).all()

@router.get("/", response_model=List[ResourceRead])
def list_resources(resource_type: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(Resource).filter(Resource.is_active == True)
    if resource_type:
        q = q.filter(Resource.resource_type == resource_type)
    return q.limit(50).all()

@router.patch("/{resource_id}/progress")
def update_progress(resource_id: int, payload: UserResourceProgressUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    progress = db.query(UserResourceProgress).filter(
        UserResourceProgress.user_id == current_user.id,
        UserResourceProgress.resource_id == resource_id
    ).first()
    if not progress:
        progress = UserResourceProgress(user_id=current_user.id, resource_id=resource_id)
        db.add(progress)
    progress.status = payload.status
    progress.progress_percent = payload.progress_percent
    if payload.status == "completed":
        progress.completed_at = datetime.utcnow()
    db.commit()
    return {"message": "updated"}

