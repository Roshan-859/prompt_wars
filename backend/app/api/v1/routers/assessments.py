from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.assessment import Assessment, AssessmentAttempt, AssessmentQuestion
from app.models.skill import Skill
from app.schemas.assessment import AssessmentRead, AssessmentSubmit, AssessmentAttemptRead
from app.agents.orchestrator import Orchestrator

router = APIRouter(prefix="/assessments", tags=["assessments"])

@router.get("/", response_model=List[AssessmentRead])
def list_assessments(db: Session = Depends(get_db)):
    return db.query(Assessment).filter(Assessment.is_active == True).all()

@router.get("/{assessment_id}", response_model=AssessmentRead)
def get_assessment(assessment_id: int, db: Session = Depends(get_db)):
    a = db.query(Assessment).get(assessment_id)
    if not a:
        raise HTTPException(status_code=404, detail="Not found")
    return a

@router.post("/{assessment_id}/attempt")
def start_attempt(assessment_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    attempt = AssessmentAttempt(user_id=current_user.id, assessment_id=assessment_id, status="in_progress")
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    return {"attempt_id": attempt.id}

@router.post("/{assessment_id}/submit", response_model=AssessmentAttemptRead)
def submit_attempt(assessment_id: int, payload: AssessmentSubmit, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    assessment = db.query(Assessment).get(assessment_id)
    if not assessment:
        raise HTTPException(status_code=404, detail="Not found")

    questions = db.query(AssessmentQuestion).filter(AssessmentQuestion.assessment_id == assessment_id).all()
    total_points = sum(q.points for q in questions)
    earned = 0.0
    weak_topics = []

    for q in questions:
        answer = payload.answers.get(str(q.id), "")
        if answer.strip().lower() == q.correct_answer.strip().lower():
            earned += q.points
        else:
            if q.topic_tags:
                weak_topics.extend(q.topic_tags)

    percentage = round((earned / total_points * 100) if total_points > 0 else 0.0, 1)

    attempt = db.query(AssessmentAttempt).filter(
        AssessmentAttempt.user_id == current_user.id,
        AssessmentAttempt.assessment_id == assessment_id,
        AssessmentAttempt.status == "in_progress"
    ).first()

    if not attempt:
        attempt = AssessmentAttempt(user_id=current_user.id, assessment_id=assessment_id)
        db.add(attempt)

    attempt.score = earned
    attempt.max_score = total_points
    attempt.percentage = percentage
    attempt.answers = payload.answers
    attempt.weak_topics = list(set(weak_topics))
    attempt.status = "completed"
    attempt.completed_at = datetime.utcnow()
    db.commit()
    db.refresh(attempt)

    if assessment.skill_id:
        skill = db.query(Skill).get(assessment.skill_id)
        if skill:
            orchestrator = Orchestrator(db)
            orchestrator.run_pipeline("assessment_completed", current_user.id, {
                "skill": skill.name,
                "score": percentage,
                "weak_topics": attempt.weak_topics,
                "assessment_id": assessment_id,
            })

    return attempt

@router.get("/me/history", response_model=List[AssessmentAttemptRead])
def get_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(AssessmentAttempt).filter(AssessmentAttempt.user_id == current_user.id).all()

