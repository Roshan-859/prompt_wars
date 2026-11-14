"""Assessment evaluator agent — grades answers and identifies weak topics."""
from datetime import datetime
from collections import Counter

from app.agents.base import BaseAgent
from app.agents.schemas import AgentInput, AgentOutput
from app.models.assessment import Assessment, AssessmentAttempt, AssessmentQuestion


class AssessmentEvaluatorAgent(BaseAgent):
    name = "assessment_evaluator"
    description = "Grades assessment answers and surfaces weak topic areas"

    def run(self, input: AgentInput) -> AgentOutput:  # noqa: A002
        messages: list = []
        try:
            user_id = input.user_id
            attempt_id = input.payload.get("attempt_id")
            answers: dict = input.payload.get("answers", {})

            attempt = (
                self.db.query(AssessmentAttempt)
                .filter(
                    AssessmentAttempt.id == attempt_id,
                    AssessmentAttempt.user_id == user_id,
                )
                .first()
            )
            if not attempt:
                return AgentOutput(
                    run_id=input.run_id,
                    agent_name=self.name,
                    success=False,
                    error="Assessment attempt not found",
                )

            assessment = (
                self.db.query(Assessment)
                .filter(Assessment.id == attempt.assessment_id)
                .first()
            )
            questions = (
                self.db.query(AssessmentQuestion)
                .filter(AssessmentQuestion.assessment_id == assessment.id)
                .all()
            )

            # Grade
            total_points = sum(q.points for q in questions)
            earned_points = 0.0
            wrong_tags: list[str] = []

            for q in questions:
                user_answer = answers.get(str(q.id), "")
                if user_answer.strip().lower() == q.correct_answer.strip().lower():
                    earned_points += q.points
                else:
                    wrong_tags.extend(q.topic_tags or [])

            percentage = round((earned_points / total_points * 100) if total_points else 0, 1)

            # Find most-missed topics
            tag_counts = Counter(wrong_tags)
            weak_topics = [tag for tag, _ in tag_counts.most_common(5)]

            attempt.score = earned_points
            attempt.max_score = total_points
            attempt.percentage = percentage
            attempt.answers = answers
            attempt.weak_topics = weak_topics
            attempt.status = "completed"
            attempt.completed_at = datetime.utcnow()
            self.db.commit()

            result = {
                "attempt_id": attempt_id,
                "score": earned_points,
                "max_score": total_points,
                "percentage": percentage,
                "weak_topics": weak_topics,
                "passed": percentage >= (assessment.passing_score if assessment else 70),
                "skill": assessment.skill_id if assessment else None,
            }
            messages.append(
                self._create_message(
                    input.run_id,
                    self.name,
                    "orchestrator",
                    "assessment_graded",
                    result,
                )
            )
            return AgentOutput(
                run_id=input.run_id,
                agent_name=self.name,
                success=True,
                result=result,
                messages=messages,
                next_agents=["skill_analyzer"],
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
