from typing import Any, Dict, List

from app.llm.base import LLMProvider

DEMO_RESPONSES: Dict[str, str] = {
    "skill_analysis": (
        "Based on your skill profile, I've identified key strengths and gaps. "
        "Your technical foundation is solid, but there are opportunities to deepen "
        "your expertise in modern frameworks and cloud technologies."
    ),
    "career_guidance": (
        "Your profile shows strong alignment with Full Stack Development. I recommend "
        "focusing on React advanced patterns and Node.js microservices to reach "
        "senior-level readiness within 6 months."
    ),
    "roadmap_explanation": (
        "I've generated a personalized 4-phase roadmap starting with Frontend "
        "Foundations. Each phase builds on the previous, with practical projects "
        "to validate your learning."
    ),
    "gap_analysis": (
        "Analysis complete. You have 7 strong skills, 4 intermediate skills needing "
        "improvement, and 5 missing skills critical for your target career. "
        "Your readiness score is 67%."
    ),
    "assessment_feedback": (
        "Your JavaScript assessment score of 42% indicates gaps in closures and "
        "async/await patterns. I've triggered a learning recovery path with "
        "targeted resources."
    ),
    "weekly_plan": (
        "Here's your personalized weekly plan: Monday-Tuesday: JavaScript async "
        "patterns (2h each), Wednesday: React hooks deep dive (3h), "
        "Thursday-Friday: Practice projects (2h each), Weekend: Review and "
        "flashcards (1h)."
    ),
    "next_steps": (
        "Based on your progress, your immediate next steps are: "
        "1) Complete the JavaScript Advanced module, "
        "2) Take the React Fundamentals assessment, "
        "3) Start building your portfolio project."
    ),
    "default": (
        "I'm your AI Mentor powered by SkillPilot's intelligence engine. I'm here "
        "to guide your learning journey, analyze your skills, and help you reach "
        "your career goals. How can I help you today?"
    ),
}


class DemoLLMProvider(LLMProvider):
    """Mock LLM provider that returns canned responses based on keyword matching."""

    def is_demo(self) -> bool:
        return True

    def chat(self, messages: List[Dict[str, str]], **kwargs: Any) -> str:
        last_user_message = ""
        for msg in reversed(messages):
            if msg.get("role") == "user":
                last_user_message = msg.get("content", "").lower()
                break

        if "skill" in last_user_message and (
            "gap" in last_user_message or "analyz" in last_user_message
        ):
            return DEMO_RESPONSES["gap_analysis"]
        elif "week" in last_user_message and "plan" in last_user_message:
            return DEMO_RESPONSES["weekly_plan"]
        elif "next" in last_user_message or "learn" in last_user_message:
            return DEMO_RESPONSES["next_steps"]
        elif "career" in last_user_message or "readiness" in last_user_message:
            return DEMO_RESPONSES["career_guidance"]
        elif "roadmap" in last_user_message:
            return DEMO_RESPONSES["roadmap_explanation"]
        elif "assessment" in last_user_message or "score" in last_user_message:
            return DEMO_RESPONSES["assessment_feedback"]
        else:
            return DEMO_RESPONSES["default"]
