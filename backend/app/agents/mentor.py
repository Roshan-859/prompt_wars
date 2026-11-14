"""AI Mentor agent — handles conversational guidance using the LLM provider."""
from app.agents.base import BaseAgent
from app.agents.schemas import AgentInput, AgentOutput
from app.llm.factory import get_llm_provider
from app.models.agent import MentorConversation, MentorMessage
from app.models.career import Career
from app.models.profile import Profile
from app.models.skill import UserSkill


class MentorAgent(BaseAgent):
    name = "mentor"
    description = "AI-powered mentor that provides personalized guidance and answers"

    def run(self, input: AgentInput) -> AgentOutput:  # noqa: A002
        messages: list = []
        try:
            user_id = input.user_id
            user_message = input.payload.get("message", "")
            conversation_id = input.payload.get("conversation_id")

            # Fetch or create conversation
            if conversation_id:
                conversation = (
                    self.db.query(MentorConversation)
                    .filter(
                        MentorConversation.id == conversation_id,
                        MentorConversation.user_id == user_id,
                    )
                    .first()
                )
            else:
                conversation = None

            if not conversation:
                conversation = MentorConversation(user_id=user_id)
                self.db.add(conversation)
                self.db.flush()

            # Build LLM context from conversation history (last 10 turns)
            history = (
                self.db.query(MentorMessage)
                .filter(MentorMessage.conversation_id == conversation.id)
                .order_by(MentorMessage.id.desc())
                .limit(10)
                .all()
            )
            history_msgs = [
                {"role": m.role, "content": m.content} for m in reversed(history)
            ]

            # Enrich context with profile data
            profile = (
                self.db.query(Profile).filter(Profile.user_id == user_id).first()
            )
            career_name = ""
            if profile and profile.target_career_id:
                career = (
                    self.db.query(Career)
                    .filter(Career.id == profile.target_career_id)
                    .first()
                )
                career_name = career.name if career else ""

            user_skills = (
                self.db.query(UserSkill).filter(UserSkill.user_id == user_id).all()
            )
            skill_summary = f"{len(user_skills)} skills tracked"

            system_prompt = (
                f"You are SkillPilot AI Mentor. The user's target career is "
                f"'{career_name or 'not set'}' and they have {skill_summary}. "
                "Provide concise, actionable, encouraging guidance."
            )

            llm_messages = [{"role": "system", "content": system_prompt}]
            llm_messages.extend(history_msgs)
            llm_messages.append({"role": "user", "content": user_message})

            # Call LLM
            llm = get_llm_provider()
            response_text = llm.chat(llm_messages)

            # Persist messages
            user_msg_row = MentorMessage(
                conversation_id=conversation.id,
                role="user",
                content=user_message,
            )
            assistant_msg_row = MentorMessage(
                conversation_id=conversation.id,
                role="assistant",
                content=response_text,
            )
            self.db.add(user_msg_row)
            self.db.add(assistant_msg_row)
            self.db.commit()

            result = {
                "conversation_id": conversation.id,
                "response": response_text,
                "is_demo": llm.is_demo(),
            }
            messages.append(
                self._create_message(
                    input.run_id, self.name, "orchestrator", "mentor_response", result
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
            self.db.rollback()
            return AgentOutput(
                run_id=input.run_id,
                agent_name=self.name,
                success=False,
                error=str(exc),
                messages=messages,
            )
