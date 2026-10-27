import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from backend root or parent
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

class Settings:
    PORT: int = int(os.getenv("PORT", 8000))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # AI Engine Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Supabase Keys
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    
    @property
    def is_ai_configured(self) -> bool:
        return bool(
            (self.GEMINI_API_KEY and "your_gemini_api_key" not in self.GEMINI_API_KEY) or
            (self.OPENAI_API_KEY and "your_openai_api_key" not in self.OPENAI_API_KEY)
        )

settings = Settings()
