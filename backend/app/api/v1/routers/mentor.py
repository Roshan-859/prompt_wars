from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.agent import MentorConversation, MentorMessage, AgentMessage
from app.models.profile import Profile
from app.models.career import Career
from app.schemas.agent import MentorConversationRead, MentorChatRequest
from app.agents.orchestrator import Orchestrator
from app.agents.mentor import MentorAgent
from app.agents.schemas import AgentInput

router = APIRouter(prefix="/mentor", tags=["mentor"])

@router.get("/conversations", response_model=List[MentorConversationRead])
def list_conversations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(MentorConversation).filter(MentorConversation.user_id == current_user.id).all()

@router.post("/chat")
def chat(payload: MentorChatRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    conv_id = payload.conversation_id
    if conv_id:
        conv = db.query(MentorConversation).filter(
            MentorConversation.id == conv_id,
            MentorConversation.user_id == current_user.id
        ).first()
        if not conv:
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        conv = MentorConversation(user_id=current_user.id, title=payload.message[:50])
        db.add(conv)
        db.flush()

    user_msg = MentorMessage(conversation_id=conv.id, role="user", content=payload.message)
    db.add(user_msg)
    db.flush()

    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    career = None
    if profile and profile.target_career_id:
        career = db.query(Career).get(profile.target_career_id)

    context = {
        "user_name": current_user.full_name,
        "target_career": career.name if career else "Not set",
        "education": profile.education_level if profile else "Unknown",
    }

    orchestrator = Orchestrator(db)
    run_id = orchestrator.run_pipeline("mentor_chat", current_user.id, {"message": payload.message}, context)

    # Fetch response from agent execution
    mentor_agent = MentorAgent(db)
    inp = AgentInput(
        run_id=run_id,
        user_id=current_user.id,
        event="mentor_chat",
        payload={"message": payload.message},
        context=context
    )
    out = mentor_agent.run(inp)
    response_text = out.result.get("response", "I'm here to help guide your learning journey!")

    assistant_msg = MentorMessage(conversation_id=conv.id, role="assistant", content=response_text)
    db.add(assistant_msg)
    db.commit()

    return {
        "conversation_id": conv.id,
        "message": response_text,
        "run_id": run_id,
    }

