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

        # Initialize chat service with error handling
        try:
            chat_service = ChatService()
        except Exception as service_init_error:
            print(f"Chat service initialization error: {service_init_error}")
            # Use the error handler agent to provide a user-friendly message
            try:
                import importlib.util
                from pathlib import Path

                # Find the backend file
                possible_paths = [
                    Path(__file__).parent.parent.parent.parent / "src/backend/__init__.py",  # backend/app/src/backend/
                    Path(__file__).parent.parent.parent.parent.parent / "backend/src/backend/__init__.py",  # project_root/backend/src/backend/
                    Path(__file__).parent.parent.parent.parent.parent / "src/backend/__init__.py",  # project_root/src/backend/
                ]

                backend_file = None
                for path in possible_paths:
                    if path.exists():
                        backend_file = path
                        break

                if backend_file:
                    spec = importlib.util.spec_from_file_location("backend", str(backend_file))
                    backend_module = importlib.util.module_from_spec(spec)
                    spec.loader.exec_module(backend_module)

                    # Run the error handler agent to get a user-friendly message
                    error_result = backend_module.Runner.run_sync(
                        starting_agent=backend_module.agent2,  # Use the error handler agent
                        input=f"The AI assistant is currently unavailable due to a service initialization error: {str(service_init_error)}. Please provide a user-friendly message to the user explaining the situation.",
                        # run_config=backend_module.run_config
                    )

                    # Return the user-friendly error message from the error handler agent
                    return ChatResponse(
                        response=error_result.final_output,
                        sessionId=session_id,
                        timestamp=datetime.utcnow().isoformat(),
                        blocked=False
                    )
                else:
                    # If we can't find the backend file, return a generic message
                    return ChatResponse(
                        response="I'm sorry, the AI assistant is currently unavailable. Please try again later.",
                        sessionId=session_id,
                        timestamp=datetime.utcnow().isoformat(),
                        blocked=False
                    )
            except Exception as handler_error:
                print(f"Error handler failed during service initialization: {handler_error}")
                # If error handler also fails, we still try to use the error handler agent with a simpler input
                try:
                    import importlib.util
                    from pathlib import Path

                    possible_paths = [
                        Path(__file__).parent.parent.parent.parent / "src/backend/__init__.py",  # backend/app/src/backend/
                        Path(__file__).parent.parent.parent.parent.parent / "backend/src/backend/__init__.py",  # project_root/backend/src/backend/
                        Path(__file__).parent.parent.parent.parent.parent / "src/backend/__init__.py",  # project_root/src/backend/
                    ]

                    backend_file = None
                    for path in possible_paths:
                        if path.exists():
                            backend_file = path
                            break

                    if backend_file:
                        spec = importlib.util.spec_from_file_location("backend", str(backend_file))
                        backend_module = importlib.util.module_from_spec(spec)
                        spec.loader.exec_module(backend_module)

                        # Use error handler agent with the original error
                        error_result = backend_module.Runner.run_sync(
                            starting_agent=backend_module.agent2,  # Use the error handler agent
                            input=f"A system error occurred during service initialization and the error handling system also encountered an issue: {str(handler_error)}. Please provide a user-friendly message to the user.",
                            # run_config=backend_module.run_config
                        )

                        return ChatResponse(
                            response=error_result.final_output,
                            sessionId=session_id,
                            timestamp=datetime.utcnow().isoformat(),
                            blocked=False
                        )
                    else:
                        # As a last resort, return a generic message
                        return ChatResponse(
                            response="I'm sorry, I encountered an issue while processing your request. Please try again or rephrase your question.",
                            sessionId=session_id,
                            timestamp=datetime.utcnow().isoformat(),
                            blocked=False
                        )
                except Exception:
                    # If all error handling fails, return a final fallback
                    return ChatResponse(
                        response="I'm sorry, I encountered an issue while processing your request. Please try again or rephrase your question.",
                        sessionId=session_id,
                        timestamp=datetime.utcnow().isoformat(),
                        blocked=False
                    )

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
        # Handle unexpected errors with graceful fallback
        print(f"Chat endpoint error: {e}")
        try:
            # Import the backend module to access the error handler agent
            import importlib.util
            from pathlib import Path
            import sys

            # Find the backend file
            possible_paths = [
                Path(__file__).parent.parent.parent.parent / "src/backend/__init__.py",  # backend/app/src/backend/
                Path(__file__).parent.parent.parent.parent.parent / "backend/src/backend/__init__.py",  # project_root/backend/src/backend/
                Path(__file__).parent.parent.parent.parent.parent / "src/backend/__init__.py",  # project_root/src/backend/
            ]

            backend_file = None
            for path in possible_paths:
                if path.exists():
                    backend_file = path
                    break

            if backend_file:
                spec = importlib.util.spec_from_file_location("backend", str(backend_file))
                backend_module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(backend_module)

                # Run the error handler agent to get a user-friendly message
                error_result = backend_module.Runner.run_sync(
                    starting_agent=backend_module.agent2,  # Use the error handler agent
                    input=f"This error occurred when processing a user request: {str(e)}. Please provide a user-friendly message to the user.",
                    # run_config=backend_module.run_config
                )

                # Return the user-friendly error message
                return ChatResponse(
                    response=error_result.final_output,
                    sessionId=request.sessionId or generate_session_id(),
                    timestamp=datetime.utcnow().isoformat(),
                    blocked=False
                )
            else:
                # If we can't find the backend file, return a generic message
                return ChatResponse(
                    response="I'm sorry, I encountered an issue while processing your request. Please try again or rephrase your question.",
                    sessionId=request.sessionId or generate_session_id(),
                    timestamp=datetime.utcnow().isoformat(),
                    blocked=False
                )
        except Exception as handler_error:
            # If the error handler also fails, we still try to use the error handler agent with a simpler input
            print(f"Error handler failed: {handler_error}")
            try:
                # Try to create a minimal backend import just for the error handler
                import importlib.util
                from pathlib import Path

                possible_paths = [
                    Path(__file__).parent.parent.parent.parent / "src/backend/__init__.py",  # backend/app/src/backend/
                    Path(__file__).parent.parent.parent.parent.parent / "backend/src/backend/__init__.py",  # project_root/backend/src/backend/
                    Path(__file__).parent.parent.parent.parent.parent / "src/backend/__init__.py",  # project_root/src/backend/
                ]

                backend_file = None
                for path in possible_paths:
                    if path.exists():
                        backend_file = path
                        break

                if backend_file:
                    spec = importlib.util.spec_from_file_location("backend", str(backend_file))
                    backend_module = importlib.util.module_from_spec(spec)
                    spec.loader.exec_module(backend_module)

                    # Use error handler agent with the original error
                    error_result = backend_module.Runner.run_sync(
                        starting_agent=backend_module.agent2,  # Use the error handler agent
                        input=f"A system error occurred and the error handling system also encountered an issue: {str(handler_error)}. Please provide a user-friendly message to the user.",
                        # run_config=backend_module.run_config
                    )

                    return ChatResponse(
                        response=error_result.final_output,
                        sessionId=request.sessionId or generate_session_id(),
                        timestamp=datetime.utcnow().isoformat(),
                        blocked=False
                    )
                else:
                    # As a last resort, return a generic message
                    return ChatResponse(
                        response="I'm sorry, I encountered an issue while processing your request. Please try again or rephrase your question.",
                        sessionId=request.sessionId or generate_session_id(),
                        timestamp=datetime.utcnow().isoformat(),
                        blocked=False
                    )
            except Exception:
                # If all error handling fails, return a fallback error message
                return ChatResponse(
                    response="I'm sorry, I encountered an issue while processing your request. Please try again or rephrase your question.",
                    sessionId=request.sessionId or generate_session_id(),
                    timestamp=datetime.utcnow().isoformat(),
                    blocked=False
                )