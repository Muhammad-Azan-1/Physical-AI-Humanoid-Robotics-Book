from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.v1.chat import router as chat_router
from .core.config import settings


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI Chatbot for the Physical AI & Humanoid Robotics documentation website",
    version=settings.VERSION
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(chat_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "Physical AI & Humanoid Robotics Chatbot API", "status": "active"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": "2025-12-19T10:00:00Z"}