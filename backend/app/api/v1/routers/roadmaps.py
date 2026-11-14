from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.roadmap import Roadmap, RoadmapModule
from app.schemas.roadmap import RoadmapRead, RoadmapModuleUpdate
from app.agents.orchestrator import Orchestrator
from datetime import datetime

router = APIRouter(prefix="/roadmaps", tags=["roadmaps"])

@router.get("/active", response_model=RoadmapRead)
def get_active_roadmap(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    roadmap = db.query(Roadmap).filter(Roadmap.user_id == current_user.id, Roadmap.status == "active").first()
    if not roadmap:
        raise HTTPException(status_code=404, detail="No active roadmap")
    return roadmap

@router.post("/generate")
def generate_roadmap(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    orchestrator = Orchestrator(db)
    run_id = orchestrator.run_pipeline("onboarding_completed", current_user.id, {})
    roadmap = db.query(Roadmap).filter(Roadmap.user_id == current_user.id, Roadmap.status == "active").first()
    if not roadmap:
        raise HTTPException(status_code=500, detail="Roadmap generation failed")
    return {"run_id": run_id, "roadmap_id": roadmap.id}

@router.patch("/modules/{module_id}")
def update_module(module_id: int, payload: RoadmapModuleUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    module = db.query(RoadmapModule).get(module_id)
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    module.status = payload.status
    if payload.status == "completed":
        module.completed_at = datetime.utcnow()
    db.commit()

    phase = module.phase
    all_modules = phase.modules
    completed = sum(1 for m in all_modules if m.status == "completed")
    if completed == len(all_modules):
        phase.status = "completed"

    roadmap = phase.roadmap
    all_mods = [m for p in roadmap.phases for m in p.modules]
    total_completed = sum(1 for m in all_mods if m.status == "completed")
    roadmap.completion_percentage = round(total_completed / len(all_mods) * 100, 1) if all_mods else 0.0
    db.commit()
    return {"message": "updated", "module_id": module_id}

