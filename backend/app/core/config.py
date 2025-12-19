import os
from typing import Optional


class Settings:
    """
    Application settings loaded from environment variables
    """
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Physical AI & Humanoid Robotics Chatbot API"
    VERSION: str = "1.0.0"

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Redis Configuration
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    SESSION_EXPIRY_HOURS: int = int(os.getenv("SESSION_EXPIRY_HOURS", "24"))

    # API Keys
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY")
    PINECONE_API_KEY: Optional[str] = os.getenv("PINECONE_API_KEY")

    # CORS Configuration
    BACKEND_CORS_ORIGINS: str = os.getenv("BACKEND_CORS_ORIGINS", "http://localhost,http://localhost:3000,http://localhost:3001")

    # Pinecone Configuration
    PINECONE_INDEX_NAME: str = os.getenv("PINECONE_INDEX_NAME", "bookcontentembeddings")

    # Performance
    MAX_MESSAGE_LENGTH: int = 10000  # Maximum length of a single message
    MAX_HISTORY_MESSAGES: int = 50   # Maximum number of messages to keep in conversation history

    # Agent Configuration
    AGENT_MODEL_NAME: str = os.getenv("AGENT_MODEL_NAME", "gemini-2.5-flash")
    AGENT_TEMPERATURE: float = float(os.getenv("AGENT_TEMPERATURE", "0.7"))


settings = Settings()