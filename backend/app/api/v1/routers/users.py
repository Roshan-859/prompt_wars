from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.profile import Profile
from app.schemas.user import UserRead, UserUpdate
from app.schemas.profile import ProfileRead, ProfileUpdate
from app.services.readiness import get_user_readiness

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserRead)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.patch("/me", response_model=UserRead)
def update_me(payload: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    for key, value in payload.model_dump(exclude_none=True).items():
        setattr(current_user, key, value)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/me/profile", response_model=ProfileRead)
def get_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.patch("/me/profile", response_model=ProfileRead)
def update_profile(payload: ProfileUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        profile = Profile(user_id=current_user.id)
        db.add(profile)
    for key, value in payload.model_dump(exclude_none=True).items():
        setattr(profile, key, value)
    db.commit()
    db.refresh(profile)
    return profile

@router.get("/me/readiness")
def get_readiness(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_user_readiness(db, current_user.id)

