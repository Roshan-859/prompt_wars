from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.assessment import AssessmentAttempt
from app.models.roadmap import Roadmap
from app.services.readiness import get_user_readiness

router = APIRouter(prefix="/progress", tags=["progress"])

@router.get("/overview")
def get_overview(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    readiness = get_user_readiness(db, current_user.id)
    attempts = db.query(AssessmentAttempt).filter(
        AssessmentAttempt.user_id == current_user.id,
        AssessmentAttempt.status == "completed"
    ).all()

    roadmap = db.query(Roadmap).filter(Roadmap.user_id == current_user.id, Roadmap.status == "active").first()
    completed_modules = 0
    total_modules = 0
    if roadmap:
        all_mods = [m for p in roadmap.phases for m in p.modules]
        total_modules = len(all_mods)
        completed_modules = sum(1 for m in all_mods if m.status == "completed")

    valid_percentages = [a.percentage for a in attempts if a.percentage is not None]
    avg_score = round(sum(valid_percentages) / len(valid_percentages), 1) if valid_percentages else 0.0

    return {
        "readiness_score": readiness.get("readiness_score", 0.0),
        "assessments_completed": len(attempts),
        "avg_assessment_score": avg_score,
        "modules_completed": completed_modules,
        "total_modules": total_modules,
        "roadmap_completion": roadmap.completion_percentage if roadmap else 0.0,
    }

