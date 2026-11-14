from app.agents.base import BaseAgent
from app.agents.schemas import AgentInput, AgentOutput
from app.models.career import CareerSkill
from app.models.profile import Profile
from app.models.resource import Resource, ResourceSkill
from app.models.skill import UserSkill


class ResourceDiscoveryAgent(BaseAgent):
    name = "resource_discovery"
    description = "Finds and recommends personalized learning resources"

    def run(self, input: AgentInput) -> AgentOutput:  # noqa: A002
        messages: list = []
        try:
            user_id = input.user_id
            profile = (
                self.db.query(Profile).filter(Profile.user_id == user_id).first()
            )
            career_id = profile.target_career_id if profile else None

            # Determine which skill IDs are gaps from payload or career
            gap_skill_ids: list[int] = input.payload.get("gap_skill_ids", [])
            if not gap_skill_ids and career_id:
                user_skills = (
                    self.db.query(UserSkill)
                    .filter(UserSkill.user_id == user_id)
                    .all()
                )
                user_skill_map = {us.skill_id: us for us in user_skills}
                career_skills = (
                    self.db.query(CareerSkill)
                    .filter(CareerSkill.career_id == career_id)
                    .all()
                )
                gap_skill_ids = [
                    cs.skill_id
                    for cs in career_skills
                    if not user_skill_map.get(cs.skill_id)
                    or user_skill_map[cs.skill_id].proficiency < cs.min_proficiency
                ]

            # Find resources that cover the gap skills
            recommended: list[dict] = []
            if gap_skill_ids:
                resource_skill_rows = (
                    self.db.query(ResourceSkill)
                    .filter(ResourceSkill.skill_id.in_(gap_skill_ids))
                    .all()
                )
                seen_resource_ids: set[int] = set()
                for rs in resource_skill_rows:
                    if rs.resource_id not in seen_resource_ids:
                        seen_resource_ids.add(rs.resource_id)
                        resource = (
                            self.db.query(Resource)
                            .filter(Resource.id == rs.resource_id, Resource.is_active.is_(True))
                            .first()
                        )
                        if resource:
                            recommended.append(
                                {
                                    "resource_id": resource.id,
                                    "title": resource.title,
                                    "skill_id": rs.skill_id,
                                    "relevance": rs.relevance,
                                    "platform": resource.platform,
                                    "resource_type": resource.resource_type,
                                }
                            )
                        if len(recommended) >= 20:
                            break

            result = {
                "recommended_resources": recommended,
                "total_found": len(recommended),
                "gap_skills_addressed": len(gap_skill_ids),
            }
            messages.append(
                self._create_message(
                    input.run_id,
                    self.name,
                    "orchestrator",
                    "resources_discovered",
                    result,
                )
            )
            return AgentOutput(
                run_id=input.run_id,
                agent_name=self.name,
                success=True,
                result=result,
                messages=messages,
            )
        except Exception as exc:
            return AgentOutput(
                run_id=input.run_id,
                agent_name=self.name,
                success=False,
                error=str(exc),
                messages=messages,
            )
