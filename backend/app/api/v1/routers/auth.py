from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User
from app.models.profile import Profile
from app.schemas.user import UserCreate, UserRead, Token, LoginRequest, RefreshRequest
from app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token, decode_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=Token)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=get_password_hash(payload.password),
        role=payload.role,
        is_active=True,
    )
    db.add(user)
    db.flush()
    profile = Profile(user_id=user.id)
    db.add(profile)
    db.commit()
    db.refresh(user)
    return Token(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
        user=UserRead.model_validate(user),
    )

@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return Token(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
        user=UserRead.model_validate(user),
    )

@router.post("/refresh")
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
    decoded = decode_token(payload.refresh_token)
    if not decoded or decoded.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    user = db.query(User).filter(User.id == int(decoded["sub"])).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return {"access_token": create_access_token(user.id), "token_type": "bearer"}

