from pydantic import BaseModel, Field
from typing import Optional
import uuid
from datetime import datetime


class ChatRequest(BaseModel):
    """
    Request model for the chat endpoint
    """
    message: str = Field(
        ...,
        description="The user's message to send to the AI assistant",
        min_length=1,
        max_length=10000
    )
    sessionId: Optional[str] = Field(
        None,
        description="Existing session ID to continue a conversation, generates new if not provided"
    )

    class Config:
        schema_extra = {
            "example": {
                "message": "What is physical AI and how does it relate to humanoid robotics?",
                "sessionId": "abc123def456"  # Optional
            }
        }


class ChatResponse(BaseModel):
    """
    Response model for the chat endpoint
    """
    response: str = Field(
        ...,
        description="The AI assistant's response to the user's message"
    )
    sessionId: str = Field(
        ...,
        description="The session ID (existing or newly generated)"
    )
    timestamp: str = Field(
        ...,
        description="ISO 8601 formatted timestamp of the response"
    )
    blocked: bool = Field(
        False,
        description="Indicates if the response was blocked by content guardrails"
    )

    class Config:
        schema_extra = {
            "example": {
                "response": "Physical AI refers to the integration of artificial intelligence with physical systems...",
                "sessionId": "abc123def456",
                "timestamp": "2025-12-19T10:00:00Z",
                "blocked": False
            }
        }


class ErrorResponse(BaseModel):
    """
    Error response model for the chat endpoint
    """
    error: str = Field(
        ...,
        description="Error message describing what went wrong"
    )
    errorCode: str = Field(
        ...,
        description="Machine-readable error code for client handling"
    )
    details: Optional[str] = Field(
        None,
        description="Additional details about the error for debugging"
    )

    class Config:
        schema_extra = {
            "example": {
                "error": "Invalid request parameters",
                "errorCode": "INVALID_REQUEST",
                "details": "Message field is required and cannot be empty"
            }
        }