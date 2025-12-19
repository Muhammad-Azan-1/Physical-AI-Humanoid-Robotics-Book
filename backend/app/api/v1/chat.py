from fastapi import APIRouter, HTTPException
from typing import Optional
from datetime import datetime
import uuid
from ...models.chat import ChatRequest, ChatResponse, ErrorResponse
from ...services.session_service import SessionService
from ...services.chat_service import ChatService
from ...core.security import generate_session_id, validate_session_id
from ...utils.validators import validate_user_input

router = APIRouter()

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Main chat endpoint that processes user messages with conversation context
    and returns AI-generated responses
    """
    try:
        # Validate the request
        if not request.message or len(request.message.strip()) == 0:
            raise HTTPException(status_code=400, detail={
                "error": "Message cannot be empty",
                "errorCode": "INVALID_REQUEST",
                "details": "Message field is required and cannot be empty"
            })

        # Validate message length
        if len(request.message) > 10000:  # 10k character limit
            raise HTTPException(status_code=400, detail={
                "error": "Message too long",
                "errorCode": "INVALID_REQUEST",
                "details": "Message exceeds maximum length of 10,000 characters"
            })

        # Get or create session ID
        session_id = request.sessionId or generate_session_id()

        if not validate_session_id(session_id):
            raise HTTPException(status_code=400, detail={
                "error": "Invalid session ID format",
                "errorCode": "INVALID_SESSION_ID",
                "details": "Session ID must be a valid UUID"
            })

        # Initialize services
        session_service = SessionService()
        chat_service = ChatService()

        # Load conversation history
        conversation_history = await session_service.get_conversation_history(session_id)

        # Process message with the existing agent
        response = await chat_service.process_message_with_agent(
            message=request.message,
            session_id=session_id,
            conversation_history=conversation_history
        )

        # Save messages to session
        await session_service.save_message_to_session(
            session_id=session_id,
            role="user",
            content=request.message
        )
        await session_service.save_message_to_session(
            session_id=session_id,
            role="assistant",
            content=response.response
        )

        # Return response
        return ChatResponse(
            response=response.response,
            sessionId=session_id,
            timestamp=datetime.utcnow().isoformat(),
            blocked=getattr(response, 'blocked', False)
        )

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Handle unexpected errors
        raise HTTPException(status_code=500, detail={
            "error": "Internal server error",
            "errorCode": "AGENT_ERROR",
            "details": str(e)
        })