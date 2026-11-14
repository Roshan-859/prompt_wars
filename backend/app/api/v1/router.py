from fastapi import APIRouter
from app.api.v1.routers import auth, users, skills, careers, roadmaps, resources, assessments, progress, mentor, agents

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(skills.router)
api_router.include_router(careers.router)
api_router.include_router(roadmaps.router)
api_router.include_router(resources.router)
api_router.include_router(assessments.router)
api_router.include_router(progress.router)
api_router.include_router(mentor.router)
api_router.include_router(agents.router)

