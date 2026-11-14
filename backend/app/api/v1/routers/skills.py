from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.skill import Skill, UserSkill
from app.schemas.skill import SkillRead, UserSkillCreate, UserSkillRead, UserSkillUpdate

router = APIRouter(prefix="/skills", tags=["skills"])

@router.get("/", response_model=List[SkillRead])
def list_skills(skill_type: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(Skill).filter(Skill.is_active == True)
    if skill_type:
        q = q.filter(Skill.skill_type == skill_type)
    return q.all()

@router.get("/me", response_model=List[UserSkillRead])
def list_my_skills(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(UserSkill).filter(UserSkill.user_id == current_user.id).all()

@router.post("/me", response_model=UserSkillRead)
def add_skill(payload: UserSkillCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing = db.query(UserSkill).filter(
        UserSkill.user_id == current_user.id,
        UserSkill.skill_id == payload.skill_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Skill already added")
    us = UserSkill(user_id=current_user.id, **payload.model_dump())
    db.add(us)
    db.commit()
    db.refresh(us)
    return us

@router.patch("/me/{user_skill_id}", response_model=UserSkillRead)
def update_skill(user_skill_id: int, payload: UserSkillUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    us = db.query(UserSkill).filter(
        UserSkill.id == user_skill_id,
        UserSkill.user_id == current_user.id
    ).first()
    if not us:
        raise HTTPException(status_code=404, detail="User skill not found")
    for key, value in payload.model_dump(exclude_none=True).items():
        setattr(us, key, value)
    db.commit()
    db.refresh(us)
    return us

@router.delete("/me/{user_skill_id}")
def delete_skill(user_skill_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    us = db.query(UserSkill).filter(
        UserSkill.id == user_skill_id,
        UserSkill.user_id == current_user.id
    ).first()
    if not us:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(us)
    db.commit()
    return {"message": "deleted"}

