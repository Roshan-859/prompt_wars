# SkillPilot AI: Personalized Learning & Career Intelligence Platform

> **Tagline:** Your Skills. Your Future. Your Intelligent Path.

SkillPilot AI is an autonomous career acceleration system that benchmarks student competencies against target engineering careers, calculates readiness percentages, and deploys **six specialized AI agents** communicating via a central orchestrator.

---

## 🏗 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, Zustand, Recharts, Framer Motion, Lucide Icons.
- **Backend**: FastAPI, Python 3.11, SQLAlchemy 2.x, Pydantic v2, JWT (Access & Refresh), Passlib/Bcrypt.
- **Database**: PostgreSQL 15.
- **AI Core**: Provider-agnostic LLM interface with Deterministic Demo Client (zero API key requirement) & OpenAI runtime support.
- **DevOps**: Docker Compose multi-container setup.

---

## 🚀 Quickstart via Docker Compose

```bash
# 1. Clone & enter repository
cd prompt_wars

# 2. Spin up Postgres, FastAPI backend & React frontend
docker compose up --build
```

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **FastAPI OpenAPI Swagger Docs**: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)
- **Backend Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

## 🔑 Preloaded Demo Credentials

The database seeds automatically on startup:
- **Email**: `demo@skillpilot.ai`
- **Password**: `demo1234`
- **Alternative Student**: `student@skillpilot.ai` / `student123`

---

## 🤖 The Six Collaborating AI Agents

1. **Skill Analyzer Agent**: Assesses proficiency across technical/soft skills and updates mastery levels.
2. **Career Intelligence Agent**: Computes weighted readiness scores and flags missing prerequisites.
3. **Path Architect Agent**: Generates phased vertical milestone roadmaps.
4. **Resource Discovery Agent**: Recommends targeted tutorials, documentation, and projects.
5. **Performance Evaluation Agent**: Monitors diagnostic assessment scores and initiates learning recovery paths.
6. **AI Mentor Agent**: Answers questions, provides strategic advice, and queries other agents.

---

## 🧪 Testing Scenarios (Agent Control Center)

Navigate to `/app/agents` in the UI to trigger live agent streaming:
- **Scenario 1**: Poor JavaScript Assessment (42%) triggers `performance_evaluation` ➔ `skill_analyzer` ➔ `path_architect` prerequisite insertion.
- **Scenario 2**: Goal change to AI Engineer triggers `career_intelligence` ➔ recalculates fit ➔ regenerates roadmap.

