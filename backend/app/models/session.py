from pydantic import BaseModel
from typing import List
from datetime import datetime


class ChatHistoryEntry(BaseModel):
    """
    Model representing a single message in chat history
    """
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: str
    status: str = "sent"  # 'sent', 'processing', 'error'


class SessionData(BaseModel):
    """
    Model representing session data
    """
    sessionId: str
    createdAt: str
    lastActiveAt: str
    expiresAt: str
    messages: List[ChatHistoryEntry]


class CreateSessionRequest(BaseModel):
    """
    Request model for creating a new session
    """
    initialMessage: str = None


class CreateSessionResponse(BaseModel):
    """
    Response model for session creation
    """
    sessionId: str
    createdAt: str
    expiresAt: str


class GetSessionResponse(BaseModel):
    """
    Response model for getting session data
    """
    sessionId: str
    messages: List[ChatHistoryEntry]
    lastActiveAt: str
    expiresAt: str