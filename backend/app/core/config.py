from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://skillpilot:skillpilot@db:5432/skillpilot"
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    LLM_PROVIDER: str = "demo"
    OPENAI_API_KEY: str = ""
    DEMO_MODE: bool = True
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:80",
        "http://frontend:80",
    ]

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
