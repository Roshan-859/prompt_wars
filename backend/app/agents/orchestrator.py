import uuid
import logging
from datetime import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session

from app.agents.schemas import AgentInput, AgentOutput
from app.agents.skill_analyzer import SkillAnalyzerAgent
from app.agents.career_intelligence import CareerIntelligenceAgent
from app.agents.path_architect import PathArchitectAgent
from app.agents.resource_discovery import ResourceDiscoveryAgent
from app.agents.assessment_evaluator import AssessmentEvaluatorAgent
from app.agents.mentor import MentorAgent
from app.models.agent import AgentRun, AgentMessage

logger = logging.getLogger(__name__)

AGENT_REGISTRY = {
    "skill_analyzer": SkillAnalyzerAgent,
    "career_intelligence": CareerIntelligenceAgent,
    "path_architect": PathArchitectAgent,
    "resource_discovery": ResourceDiscoveryAgent,
    "performance_evaluation": AssessmentEvaluatorAgent,
    "assessment_evaluator": AssessmentEvaluatorAgent,
    "ai_mentor": MentorAgent,
    "mentor": MentorAgent,
}

EVENT_PIPELINES = {
    "assessment_completed": [
        "assessment_evaluator",
        "skill_analyzer",
        "path_architect",
        "resource_discovery",
        "ai_mentor",
    ],
    "career_changed": [
        "career_intelligence",
        "skill_analyzer",
        "path_architect",
        "resource_discovery",
    ],
    "skills_updated": [
        "skill_analyzer",
        "career_intelligence",
        "path_architect",
    ],
    "module_completed": [
        "assessment_evaluator",
        "career_intelligence",
    ],
    "mentor_chat": [
        "ai_mentor",
    ],
    "onboarding_completed": [
        "skill_analyzer",
        "career_intelligence",
        "path_architect",
        "resource_discovery",
    ],
}

class Orchestrator:
    def __init__(self, db: Session):
        self.db = db

    def run_pipeline(self, event: str, user_id: int, payload: Dict[str, Any], context: Dict[str, Any] = None) -> str:
        run_id = str(uuid.uuid4())
        agent_run = AgentRun(
            run_id=run_id,
            user_id=user_id,
            trigger_event=event,
            trigger_payload=payload,
            status="running"
        )
        self.db.add(agent_run)
        self.db.commit()

        pipeline = EVENT_PIPELINES.get(event, ["skill_analyzer"])
        current_context = {**(context or {})}

        for agent_name in pipeline:
            agent_cls = AGENT_REGISTRY.get(agent_name)
            if not agent_cls:
                continue
            try:
                agent = agent_cls(self.db)
                agent_input = AgentInput(
                    run_id=run_id,
                    user_id=user_id,
                    event=event,
                    payload=payload,
                    context=current_context
                )
                output: AgentOutput = agent.run(agent_input)
                if output.result:
                    current_context.update(output.result)

                for msg in output.messages:
                    db_msg = AgentMessage(
                        run_id_fk=agent_run.id,
                        run_id=run_id,
                        from_agent=msg.get("from_agent", agent_name),
                        to_agent=msg.get("to_agent", "orchestrator"),
                        event=msg.get("event", event),
                        payload=msg.get("payload", {}),
                        status=msg.get("status", "delivered"),
                    )
                    self.db.add(db_msg)
                self.db.commit()
            except Exception as e:
                logger.error(f"Agent {agent_name} execution failed in pipeline {event}: {e}")

        agent_run.status = "completed"
        agent_run.completed_at = datetime.utcnow()
        self.db.commit()
        return run_id

