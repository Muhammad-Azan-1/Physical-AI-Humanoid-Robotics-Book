import asyncio
import sys
import os
from typing import List
from pathlib import Path

from ..models.session import ChatHistoryEntry


class ChatService:
    """
    Service for processing chat messages with the existing AI agent
    """

    def __init__(self):
        # Initialize agent attributes
        self.agent = None
        self.run_config = None
        self.query_pinecone = None
        self.input_guardrail_function = None
        self.Runner = None
        self.InputGuardrailTripwireTriggered = None

        # Import the existing agent components from the backend module
        try:
            # Import the main components from the existing agent
            import importlib.util

            # Find the backend module - try multiple possible locations
            possible_paths = [
                Path("/app/src/backend/__init__.py"),  # Railway Docker deployment
                Path(__file__).parent.parent.parent / "src/backend/__init__.py",  # backend/app/src/backend/
                Path(__file__).parent.parent.parent.parent / "backend/src/backend/__init__.py",  # project_root/backend/src/backend/
                Path(__file__).parent.parent.parent.parent / "src/backend/__init__.py",  # project_root/src/backend/
            ]

            backend_file = None
            for path in possible_paths:
                if path.exists():
                    backend_file = path
                    break

            if backend_file is None:
                raise FileNotFoundError("Backend module not found in any expected location")

            # Handle module mapping before importing
            import sys

            # Map google.genai import (for backward compatibility with existing code)
            try:
                import google.genai as genai
                if 'google.generativeai' not in sys.modules:
                    sys.modules['google.generativeai'] = genai
            except ImportError:
                pass

            # The original code expects 'agents' module, but we need to ensure the right one is available
            # If there's an issue with the agents import, we might need to handle it at runtime
            # For now, let's try to load the backend file as-is

            spec = importlib.util.spec_from_file_location("backend", str(backend_file))
            backend_module = importlib.util.module_from_spec(spec)

            # Execute the module
            spec.loader.exec_module(backend_module)

            self.agent = backend_module.agent
            self.run_config = getattr(backend_module, 'run_config', None)  # Optional
            self.query_pinecone = backend_module.query_pinecone
            self.input_guardrail_function = backend_module.input_guardrail_function
            self.Runner = backend_module.Runner
            self.InputGuardrailTripwireTriggered = backend_module.InputGuardrailTripwireTriggered

        except ImportError as e:
            print(f"Warning: Failed to import existing agent components: {e}")
            # Provide fallback values to prevent complete failure
            self.agent = None
            self.run_config = None
            self.query_pinecone = None
            self.input_guardrail_function = None
            self.Runner = None
            self.InputGuardrailTripwireTriggered = None
            raise RuntimeError(f"Failed to import existing agent components: {e}")
        except AttributeError as e:
            print(f"Warning: Required agent components not found in backend module: {e}")
            # Provide fallback values to prevent complete failure
            self.agent = None
            self.run_config = None
            self.query_pinecone = None
            self.input_guardrail_function = None
            self.Runner = None
            self.InputGuardrailTripwireTriggered = None
            raise RuntimeError(f"Required agent components not found in backend module: {e}")
        except Exception as e:
            print(f"Warning: Unexpected error during backend module import: {e}")
            # Provide fallback values to prevent complete failure
            self.agent = None
            self.run_config = None
            self.query_pinecone = None
            self.input_guardrail_function = None
            self.Runner = None
            self.InputGuardrailTripwireTriggered = None
            raise RuntimeError(f"Unexpected error importing backend module: {e}")

    def _summarize_conversation(self, conversation_history: List[ChatHistoryEntry], max_messages: int = 5) -> str:
        """
        Create a brief summary of the conversation history to save tokens.
        Only keeps the last few exchanges and summarizes them.
        """
        if not conversation_history:
            return ""
        
        # Take only the last N messages to keep context small
        recent_messages = conversation_history[-max_messages:]
        
        # Build a compact summary
        summary_parts = []
        for msg in recent_messages:
            role = "User" if msg.role == "user" else "Assistant"
            # Truncate long messages to save tokens
            content = msg.content[:150] + "..." if len(msg.content) > 150 else msg.content
            summary_parts.append(f"{role}: {content}")
        
        if summary_parts:
            return "Previous conversation:\n" + "\n".join(summary_parts) + "\n\nCurrent question: "
        return ""

    async def process_message_with_agent(self, message: str, session_id: str, conversation_history: List[ChatHistoryEntry]):
        """
        Process a user message with the existing agent
        """
        # Check if agent components are available
        if not all([self.agent, self.Runner]):
            response_obj = type('ResponseObject', (), {})()
            response_obj.response = "I'm sorry, the AI assistant is currently unavailable. Please try again later."
            response_obj.sessionId = session_id
            response_obj.blocked = False
            return response_obj

        try:
            # Create summarized context from conversation history
            context = self._summarize_conversation(conversation_history)
            
            # Combine context with current message
            full_input = context + message if context else message
            
            # Run the agent with the contextualized message
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None,
                self._run_agent_sync,
                full_input
            )

            # Return the response
            response_obj = type('ResponseObject', (), {})()
            response_obj.response = result.final_output
            response_obj.sessionId = session_id
            response_obj.blocked = False  # Will be set if guardrail triggers

            return response_obj

        except Exception as e:
            # Check if it's a guardrail exception (OFF-TOPIC question)
            # Use both isinstance and name check since module imports can differ
            is_tripwire = (
                (self.InputGuardrailTripwireTriggered and isinstance(e, self.InputGuardrailTripwireTriggered)) or
                type(e).__name__ == "InputGuardrailTripwireTriggered" or
                "tripwire" in str(type(e).__name__).lower()
            )
            
            if is_tripwire:
                try:
                    # Import the backend module to access agent2
                    import importlib.util
                    from pathlib import Path

                    possible_paths = [
                        Path("/app/src/backend/__init__.py"),  # Railway Docker
                        Path(__file__).parent.parent.parent / "src/backend/__init__.py",
                        Path(__file__).parent.parent.parent.parent / "backend/src/backend/__init__.py",
                        Path(__file__).parent.parent.parent.parent / "src/backend/__init__.py",
                    ]

                    backend_file = None
                    for path in possible_paths:
                        if path.exists():
                            backend_file = path
                            break

                    if backend_file:
                        spec = importlib.util.spec_from_file_location("backend_err", str(backend_file))
                        backend_module = importlib.util.module_from_spec(spec)
                        spec.loader.exec_module(backend_module)

                        # Pass the OFF-TOPIC context to agent2 (same style as __init__.py)
                        off_topic_context = f"""
                            The user asked: "{message}"
                            The Input Guardrail blocked this because user asked an off topic question.
                            Error details (for context only): {e}
                            Please write a polite, personalized response to the user explaining this restriction
                            and suggesting they ask about the Book instead.
                            """

                        # Use async version since we're in an async context
                        error_result = await backend_module.Runner.run(
                            starting_agent=backend_module.agent2,
                            input=off_topic_context,
                        )

                        response_obj = type('ResponseObject', (), {})()
                        response_obj.response = error_result.final_output
                        response_obj.sessionId = session_id
                        response_obj.blocked = True
                        return response_obj
                    else:
                        raise Exception("Backend module not found")
                except Exception as inner_e:
                    print(f"Error in tripwire handling: {inner_e}")
                    response_obj = type('ResponseObject', (), {})()
                    response_obj.response = "I can only answer questions about Physical AI & Humanoid Robotics."
                    response_obj.sessionId = session_id
                    response_obj.blocked = True
                    return response_obj
            else:
                # Handle SYSTEM ERRORS (not off-topic questions)
                try:
                    # Use the error handler agent for system errors
                    import importlib.util
                    from pathlib import Path

                    # Find the backend file
                    possible_paths = [
                        Path("/app/src/backend/__init__.py"),  # Railway Docker
                        Path(__file__).parent.parent.parent / "src/backend/__init__.py",  # backend/app/src/backend/
                        Path(__file__).parent.parent.parent.parent / "backend/src/backend/__init__.py",  # project_root/backend/src/backend/
                        Path(__file__).parent.parent.parent.parent / "src/backend/__init__.py",  # project_root/src/backend/
                    ]

                    backend_file = None
                    for path in possible_paths:
                        if path.exists():
                            backend_file = path
                            break

                    if backend_file:
                        spec = importlib.util.spec_from_file_location("backend_sys_err", str(backend_file))
                        backend_module = importlib.util.module_from_spec(spec)
                        spec.loader.exec_module(backend_module)

                        # Create a clear SYSTEM ERROR prompt for the error handler agent
                        system_error_prompt = f"""SCENARIO: SYSTEM ERROR (NOT an off-topic question)
A technical error occurred while processing the user's request.
The user asked: "{message}"

Please write a friendly apology explaining there was a temporary system interruption. Ask them to try again. Do NOT mention any error codes or technical details."""

                        # Use async version since we're in an async context
                        error_result = await backend_module.Runner.run(
                            starting_agent=backend_module.agent2,
                            input=system_error_prompt,
                        )

                        response_obj = type('ResponseObject', (), {})()
                        response_obj.response = error_result.final_output
                        response_obj.sessionId = session_id
                        response_obj.blocked = False

                        return response_obj
                    else:
                        # If we can't find the backend file, return a generic message
                        response_obj = type('ResponseObject', (), {})()
                        response_obj.response = "I'm sorry, I encountered an issue while processing your request. Please try again or rephrase your question."
                        response_obj.sessionId = session_id
                        response_obj.blocked = False

                        return response_obj
                except Exception:
                    # If error handler also fails, return a generic user-friendly message
                    response_obj = type('ResponseObject', (), {})()
                    response_obj.response = "I'm sorry, I encountered an issue while processing your request. Please try again or rephrase your question."
                    response_obj.sessionId = session_id
                    response_obj.blocked = False

                    return response_obj

    def _can_import_backend_module(self):
        """
        Check if backend module components are available to avoid import errors
        """
        return all([self.agent, self.Runner])

    def _run_agent_sync(self, message: str):
        """
        Run the agent synchronously (wrapper for the existing agent)
        """
        # Check if agent components are available from the instance
        if not all([self.agent, self.Runner]):
            # If components are not available from instance, try to import from backend
            import importlib.util
            import sys

            # Find the backend file - same logic as in __init__
            possible_paths = [
                Path("/app/src/backend/__init__.py"),  # Railway Docker
                Path(__file__).parent.parent.parent / "src/backend/__init__.py",  # backend/app/src/backend/
                Path(__file__).parent.parent.parent.parent / "backend/src/backend/__init__.py",  # project_root/backend/src/backend/
                Path(__file__).parent.parent.parent.parent / "src/backend/__init__.py",  # project_root/src/backend/
            ]

            backend_file = None
            for path in possible_paths:
                if path.exists():
                    backend_file = path
                    break

            if backend_file is None:
                raise FileNotFoundError("Backend module not found in any expected location")

            # Handle module mapping before importing
            try:
                import google.genai as genai
                if 'google.generativeai' not in sys.modules:
                    sys.modules['google.generativeai'] = genai
            except ImportError:
                pass

            spec = importlib.util.spec_from_file_location("backend", str(backend_file))
            backend_module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(backend_module)

            # Use the imported backend module components
            # Let InputGuardrailTripwireTriggered propagate up to be handled properly
            result = backend_module.Runner.run_sync(
                starting_agent=backend_module.agent,
                input=message,
            )
            return result
        else:
            # Use the instance components that were already loaded in __init__
            # Let InputGuardrailTripwireTriggered propagate up to be handled properly
            result = self.Runner.run_sync(
                starting_agent=self.agent,
                input=message,
            )
            return result

    async def get_agent_info(self):
        """
        Get information about the agent configuration
        """
        return {
            "agent_name": getattr(self.agent, 'name', 'Unknown'),
            "has_guardrails": self.input_guardrail_function is not None,
            "has_tools": hasattr(self.agent, 'tools') and len(getattr(self.agent, 'tools', [])) > 0
        }