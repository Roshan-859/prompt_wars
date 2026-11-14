from app.agents.base import BaseAgent
from app.agents.schemas import AgentInput, AgentOutput
from app.models.career import Career, CareerSkill
from app.models.profile import Profile
from app.models.skill import UserSkill


class CareerIntelligenceAgent(BaseAgent):
    name = "career_intelligence"
    description = "Maps role requirements, calculates compatibility and readiness scores"

    def run(self, input: AgentInput) -> AgentOutput:  # noqa: A002
        messages: list = []
        result: dict = {}
        try:
            user_id = input.user_id
            profile = (
                self.db.query(Profile).filter(Profile.user_id == user_id).first()
            )
            career_id = input.payload.get("career_id") or (
                profile.target_career_id if profile else None
            )

            if not career_id:
                return AgentOutput(
                    run_id=input.run_id,
                    agent_name=self.name,
                    success=False,
                    error="No target career configured for user",
                    messages=messages,
                )

            career = self.db.query(Career).filter(Career.id == career_id).first()
            career_skills = (
                self.db.query(CareerSkill)
                .filter(CareerSkill.career_id == career_id)
                .all()
            )
            user_skills = (
                self.db.query(UserSkill).filter(UserSkill.user_id == user_id).all()
            )
            user_skill_map = {us.skill_id: us for us in user_skills}

            total_weight = sum(cs.importance for cs in career_skills)
            matched_weight = 0.0
            missing: list = []
            gaps: list = []

            for cs in career_skills:
                us = user_skill_map.get(cs.skill_id)
                if us and us.proficiency >= cs.min_proficiency:
                    matched_weight += cs.importance
                elif us and us.proficiency > 0:
                    partial = (us.proficiency / cs.min_proficiency) * cs.importance
                    matched_weight += partial * 0.5
                    gaps.append({"skill_id": cs.skill_id, "importance": cs.importance})
                else:
                    missing.append(
                        {"skill_id": cs.skill_id, "importance": cs.importance}
                    )

            readiness = round(
                (matched_weight / total_weight * 100) if total_weight > 0 else 0, 1
            )
            result = {
                "career_id": career_id,
                "career_name": career.name if career else "",
                "readiness_score": readiness,
                "missing_skills": missing,
                "gap_skills": gaps,
                "total_required": len(career_skills),
            }
            messages.append(
                self._create_message(
                    input.run_id,
                    self.name,
                    "orchestrator",
                    "career_analysis_complete",
                    result,
                )
            )
            return AgentOutput(
                run_id=input.run_id,
                agent_name=self.name,
                success=True,
                result=result,
                messages=messages,
                next_agents=["path_architect"],
            )
        except Exception as exc:
            return AgentOutput(
                run_id=input.run_id,
                agent_name=self.name,
                success=False,
                error=str(exc),
                messages=messages,
            )
