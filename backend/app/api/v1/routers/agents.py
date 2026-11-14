from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List
import json, asyncio
from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.agent import AgentRun, AgentMessage
from app.schemas.agent import AgentRunRead, AgentMessageRead, TriggerEventRequest
from app.agents.orchestrator import Orchestrator

router = APIRouter(prefix="/agents", tags=["agents"])

@router.get("/runs", response_model=List[AgentRunRead])
def list_runs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(AgentRun).filter(AgentRun.user_id == current_user.id).order_by(AgentRun.started_at.desc()).limit(10).all()

@router.get("/runs/{run_id}/messages", response_model=List[AgentMessageRead])
def get_messages(run_id: str, db: Session = Depends(get_db)):
    return db.query(AgentMessage).filter(AgentMessage.run_id == run_id).order_by(AgentMessage.timestamp).all()

@router.post("/trigger")
def trigger_event(payload: TriggerEventRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    orchestrator = Orchestrator(db)
    run_id = orchestrator.run_pipeline(payload.event, current_user.id, payload.payload)
    return {"run_id": run_id, "status": "completed"}

@router.get("/stream/{run_id}")
async def stream_messages(run_id: str, db: Session = Depends(get_db)):
    async def event_generator():
        messages = db.query(AgentMessage).filter(AgentMessage.run_id == run_id).order_by(AgentMessage.timestamp).all()
        for msg in messages:
            data = {
                "id": msg.id,
                "run_id": msg.run_id,
                "from_agent": msg.from_agent,
                "to_agent": msg.to_agent,
                "event": msg.event,
                "payload": msg.payload,
                "status": msg.status,
                "timestamp": msg.timestamp.isoformat() if msg.timestamp else "",
            }
            yield f"data: {json.dumps(data)}\n\n"
            await asyncio.sleep(0.2)
        yield "data: {\"done\": true}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

