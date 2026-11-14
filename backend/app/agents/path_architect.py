from app.agents.base import BaseAgent
from app.agents.schemas import AgentInput, AgentOutput
from app.models.career import Career, CareerSkill
from app.models.profile import Profile
from app.models.roadmap import Roadmap, RoadmapModule, RoadmapPhase
from app.models.skill import Skill, UserSkill


class PathArchitectAgent(BaseAgent):
    name = "path_architect"
    description = "Builds and adjusts personalized learning roadmaps"

    def run(self, input: AgentInput) -> AgentOutput:  # noqa: A002
        messages: list = []
        last_phase_index: int = 0
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
                )

            career = self.db.query(Career).filter(Career.id == career_id).first()
            career_skills = (
                self.db.query(CareerSkill)
                .filter(CareerSkill.career_id == career_id)
                .order_by(CareerSkill.importance.desc())
                .all()
            )
            user_skills = (
                self.db.query(UserSkill).filter(UserSkill.user_id == user_id).all()
            )
            user_skill_map = {us.skill_id: us for us in user_skills}

            # Identify skill gaps
            gaps = [
                cs
                for cs in career_skills
                if not user_skill_map.get(cs.skill_id)
                or user_skill_map[cs.skill_id].proficiency < cs.min_proficiency
            ]

            # Archive any existing active roadmap
            existing = (
                self.db.query(Roadmap)
                .filter(Roadmap.user_id == user_id, Roadmap.status == "active")
                .first()
            )
            if existing:
                existing.status = "archived"
                self.db.commit()

            # Create roadmap
            roadmap = Roadmap(
                user_id=user_id,
                career_id=career_id,
                title=f"Path to {career.name}" if career else "Learning Roadmap",
                description=(
                    f"Personalized roadmap to become a {career.name}"
                    if career
                    else "Your personalized learning path"
                ),
                status="active",
                total_duration_weeks=len(gaps) * 2,
            )
            self.db.add(roadmap)
            self.db.flush()

            # Divide gaps into 3 phases
            phase_size = max(1, len(gaps) // 3) if gaps else 1
            phase_defs = [
                ("Foundation", gaps[:phase_size]),
                ("Core Skills", gaps[phase_size : phase_size * 2]),
                ("Advanced & Projects", gaps[phase_size * 2 :]),
            ]

            for i, (phase_name, phase_gaps) in enumerate(phase_defs):
                if not phase_gaps:
                    continue
                last_phase_index = i

                # Build objectives from first three skills in phase
                objectives = []
                for cs in phase_gaps[:3]:
                    skill = self.db.query(Skill).get(cs.skill_id)
                    objectives.append(f"Master {skill.name if skill else 'skill'}")

                phase = RoadmapPhase(
                    roadmap_id=roadmap.id,
                    title=phase_name,
                    order=i + 1,
                    duration_weeks=len(phase_gaps) * 2,
                    objectives=objectives,
                    status="active" if i == 0 else "pending",
                )
                self.db.add(phase)
                self.db.flush()

                for j, cs in enumerate(phase_gaps):
                    skill = self.db.query(Skill).get(cs.skill_id)
                    module = RoadmapModule(
                        phase_id=phase.id,
                        title=f"Learn {skill.name if skill else 'Skill'}",
                        description=(
                            f"Master {skill.name if skill else 'skill'} "
                            "to reach required proficiency"
                        ),
                        order=j + 1,
                        skill_id=cs.skill_id,
                        duration_hours=int(cs.importance * 20),
                        status="pending",
                    )
                    self.db.add(module)

            self.db.commit()
            result = {
                "roadmap_id": roadmap.id,
                "phases_created": last_phase_index + 1,
                "gaps_addressed": len(gaps),
            }
            messages.append(
                self._create_message(
                    input.run_id, self.name, "orchestrator", "roadmap_generated", result
                )
            )
            return AgentOutput(
                run_id=input.run_id,
                agent_name=self.name,
                success=True,
                result=result,
                messages=messages,
                next_agents=["resource_discovery"],
            )
        except Exception as exc:
            self.db.rollback()
            return AgentOutput(
                run_id=input.run_id,
                agent_name=self.name,
                success=False,
                error=str(exc),
                messages=messages,
            )
