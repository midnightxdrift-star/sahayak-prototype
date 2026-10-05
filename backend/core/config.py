import os
from pathlib import Path
from typing import List
from dotenv import load_dotenv

# Search and load .env from backend/ or project root
base_dir = Path(__file__).resolve().parent.parent  # backend/
root_dir = base_dir.parent  # root/

for env_file in [base_dir / ".env", root_dir / ".env", Path(".env")]:
    if env_file.exists():
        load_dotenv(env_file, override=False)

class Settings:
    PROJECT_NAME: str = "SAHAYAK — Unified Scholarship Platform"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Custom JAGO AI Service configuration
    @property
    def JAGO_API_KEY(self) -> str:
        key = os.getenv("JAGO_API_KEY", "")
        return key.strip().strip('"').strip("'")

    @property
    def JAGO_URL(self) -> str:
        url = os.getenv("JAGO_URL", "")
        return url.strip().strip('"').strip("'").rstrip("/")

    # AI configuration (Supports Grok / xAI, OpenAI, Groq, OpenRouter)
    @property
    def GROK_API_KEY(self) -> str:
        return (
            os.getenv("GROK_API_KEY") 
            or os.getenv("XAI_API_KEY") 
            or os.getenv("OPENAI_API_KEY") 
            or os.getenv("GROQ_API_KEY") 
            or ""
        ).strip()
    
    @property
    def GROK_API_URL(self) -> str:
        if os.getenv("GROK_API_URL"):
            return os.getenv("GROK_API_URL").strip()
        if os.getenv("OPENAI_API_KEY") and not os.getenv("GROK_API_KEY"):
            return "https://api.openai.com/v1/chat/completions"
        if os.getenv("GROQ_API_KEY") and not os.getenv("GROK_API_KEY"):
            return "https://api.groq.com/openai/v1/chat/completions"
        return "https://api.x.ai/v1/chat/completions"

    @property
    def GROK_MODEL(self) -> str:
        if os.getenv("GROK_MODEL"):
            return os.getenv("GROK_MODEL").strip()
        if os.getenv("OPENAI_API_KEY") and not os.getenv("GROK_API_KEY"):
            return "gpt-4o-mini"
        if os.getenv("GROQ_API_KEY") and not os.getenv("GROK_API_KEY"):
            return "llama-3.3-70b-versatile"
        return "grok-2-latest"
    
    # CORS Origins
    _frontend_origins_raw: str = os.getenv(
        "FRONTEND_ORIGIN", 
        "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000"
    )
    
    @property
    def CORS_ORIGINS(self) -> List[str]:
        return [origin.strip() for origin in self._frontend_origins_raw.split(",") if origin.strip()]

settings = Settings()
