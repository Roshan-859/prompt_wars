from app.agents.base import BaseAgent
from app.agents.schemas import AgentInput, AgentOutput
from app.models.skill import Skill, UserSkill


class SkillAnalyzerAgent(BaseAgent):
    name = "skill_analyzer"
    description = "Analyzes skills, evaluates assessments, finds strengths and weaknesses"

    def run(self, input: AgentInput) -> AgentOutput:  # noqa: A002
        messages: list = []
        result: dict = {}
        try:
            user_id = input.user_id
            payload = input.payload

            # Update proficiency when triggered by an assessment completion
            if input.event == "assessment_completed":
                skill_name = payload.get("skill", "")
                score = payload.get("score", 0)
                skill = self.db.query(Skill).filter(Skill.name == skill_name).first()
                if skill:
                    user_skill = (
                        self.db.query(UserSkill)
                        .filter(
                            UserSkill.user_id == user_id,
                            UserSkill.skill_id == skill.id,
                        )
                        .first()
                    )
                    new_proficiency = int(score)
                    new_level = (
                        "strong"
                        if score >= 75
                        else ("intermediate" if score >= 50 else "beginner")
                    )
                    if user_skill:
                        user_skill.proficiency = new_proficiency
                        user_skill.level = new_level
                        user_skill.source = "assessment"
                    else:
                        user_skill = UserSkill(
                            user_id=user_id,
                            skill_id=skill.id,
                            proficiency=new_proficiency,
                            level=new_level,
                            source="assessment",
                        )
                        self.db.add(user_skill)
                    self.db.commit()
                    result["updated_skill"] = skill_name
                    result["new_proficiency"] = new_proficiency
                    result["new_level"] = new_level

            # Aggregate skill strengths / weaknesses
            user_skills = (
                self.db.query(UserSkill).filter(UserSkill.user_id == user_id).all()
            )
            strong = [us for us in user_skills if us.proficiency >= 75]
            intermediate = [us for us in user_skills if 50 <= us.proficiency < 75]
            weak = [us for us in user_skills if us.proficiency < 50]

            result["strengths"] = [us.skill_id for us in strong]
            result["intermediate"] = [us.skill_id for us in intermediate]
            result["weaknesses"] = [us.skill_id for us in weak]
            result["total_skills"] = len(user_skills)

            messages.append(
                self._create_message(
                    input.run_id, self.name, "orchestrator", "skill_analysis_complete", result
                )
            )
            return AgentOutput(
                run_id=input.run_id,
                agent_name=self.name,
                success=True,
                result=result,
                messages=messages,
                next_agents=["career_intelligence", "path_architect"],
            )
        except Exception as exc:
            return AgentOutput(
                run_id=input.run_id,
                agent_name=self.name,
                success=False,
                error=str(exc),
                messages=messages,
            )
