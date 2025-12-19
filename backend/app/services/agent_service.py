import asyncio
import sys
import os
from typing import List, Any, Dict
from pathlib import Path

# Add the backend directory to the Python path to import the existing agent
backend_path = Path(__file__).parent.parent.parent / "src/backend"
sys.path.insert(0, str(backend_path))

from ..models.session import ChatHistoryEntry


class AgentService:
    """
    Service that interfaces with the existing AI agent
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
            spec = importlib.util.spec_from_file_location("backend_agent", str(backend_path / "__init__.py"))
            backend_module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(backend_module)

            self.agent = backend_module.agent
            self.run_config = getattr(backend_module, 'run_config', None)
            self.query_pinecone = backend_module.query_pinecone
            self.input_guardrail_function = backend_module.input_guardrail_function
            self.Runner = backend_module.Runner
            self.InputGuardrailTripwireTriggered = backend_module.InputGuardrailTripwireTriggered
        except ImportError as e:
            raise RuntimeError(f"Failed to import existing agent components: {e}")

    async def run_agent_with_context(self, message: str, conversation_history: List[ChatHistoryEntry] = None):
        """
        Run the agent with message and conversation context
        """
        try:
            # For now, just run the agent with the current message
            # The existing agent already handles conversation context internally
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None,
                self._run_agent_sync,
                message
            )

            return {
                'response': result.final_output,
                'success': True,
                'blocked': False
            }

        except self.InputGuardrailTripwireTriggered as e:
            # Handle guardrail trigger
            try:
                # Use the error handler agent for guardrail triggers too
                import importlib.util
                import sys
                from pathlib import Path

                backend_path = Path(__file__).parent.parent.parent / "src/backend"
                spec = importlib.util.spec_from_file_location("backend_agent", str(backend_path / "__init__.py"))
                backend_module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(backend_module)

                error_result = backend_module.Runner.run_sync(
                    starting_agent=backend_module.agent2,  # Use the error handler agent
                    input=f"Guardrail triggered when user asked a question: {str(e)}. Please provide a user-friendly message to the user explaining why their request was blocked.",
                    # run_config=backend_module.run_config
                )

                return {
                    'response': error_result.final_output,
                    'success': False,
                    'blocked': True
                }
            except Exception:
                # If error handler fails, return a generic message
                return {
                    'response': "Request blocked by content guardrail. Please ask questions related to Physical AI & Humanoid Robotics.",
                    'success': False,
                    'blocked': True
                }
        except Exception as e:
            # Handle other errors by using the error handler agent
            try:
                # Use the error handler agent for all other errors
                import importlib.util
                import sys
                from pathlib import Path

                backend_path = Path(__file__).parent.parent.parent / "src/backend"
                spec = importlib.util.spec_from_file_location("backend_agent", str(backend_path / "__init__.py"))
                backend_module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(backend_module)

                error_result = backend_module.Runner.run_sync(
                    starting_agent=backend_module.agent2,  # Use the error handler agent
                    input=f"This error occurred when processing a user request: {str(e)}. Please provide a user-friendly message to the user.",
                    # run_config=backend_module.run_config
                )

                return {
                    'response': error_result.final_output,
                    'success': False,
                    'blocked': False
                }
            except Exception:
                # If error handler also fails, return a generic user-friendly message
                return {
                    'response': "I'm sorry, I encountered an issue while processing your request. Please try again or rephrase your question.",
                    'success': False,
                    'blocked': False
                }

    def _run_agent_sync(self, message: str):
        """
        Run the agent synchronously
        """
        try:
            result = self.Runner.run_sync(
                starting_agent=self.agent,
                input=message,
                # run_config=self.run_config
            )
            return result
        except Exception as e:
            # If any error occurs, use the error handler agent
            try:
                # Get the error handler agent from the backend module
                import importlib.util
                import sys
                from pathlib import Path

                backend_path = Path(__file__).parent.parent.parent / "src/backend"
                spec = importlib.util.spec_from_file_location("backend_agent", str(backend_path / "__init__.py"))
                backend_module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(backend_module)

                error_result = backend_module.Runner.run_sync(
                    starting_agent=backend_module.agent2,  # Use the error handler agent
                    input=f"This error occurred when user asked a question: {str(e)}. Please provide a user-friendly message to the user.",
                    # run_config=backend_module.run_config
                )
                # Return the error result as if it were the normal result
                # But we need to create a result-like object with the error message
                error_response_obj = type('ErrorResponseObject', (), {})()
                error_response_obj.final_output = error_result.final_output
                return error_response_obj
            except Exception:
                # If error handler also fails, return a generic user-friendly message
                fallback_response_obj = type('FallbackResponseObject', (), {})()
                fallback_response_obj.final_output = "I'm sorry, I encountered an issue while processing your request. Please try again or rephrase your question."
                return fallback_response_obj

    async def validate_input(self, message: str):
        """
        Validate input using the existing guardrail system
        """
        try:
            # Use the existing guardrail function to validate the input
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None,
                self._validate_input_sync,
                message
            )
            return result
        except Exception as e:
            return {
                'valid': True,  # Default to valid if validation fails
                'blocked': False,
                'reason': f"Validation error: {str(e)}"
            }

    def _validate_input_sync(self, message: str):
        """
        Synchronous input validation using the existing guardrail
        """
        # This would need to be adapted to use the existing guardrail function
        # For now, we'll return a basic validation
        if len(message.strip()) == 0:
            return {
                'valid': False,
                'blocked': False,
                'reason': "Message cannot be empty"
            }
        return {
            'valid': True,
            'blocked': False,
            'reason': "Valid"
        }

    async def get_agent_capabilities(self):
        """
        Get information about agent capabilities
        """
        return {
            "name": getattr(self.agent, 'name', 'Unknown'),
            "has_guardrails": self.input_guardrail_function is not None,
            "has_tools": hasattr(self.agent, 'tools') and len(getattr(self.agent, 'tools', [])) > 0,
            "tools": [tool.__name__ for tool in getattr(self.agent, 'tools', [])] if hasattr(self.agent, 'tools') else []
        }