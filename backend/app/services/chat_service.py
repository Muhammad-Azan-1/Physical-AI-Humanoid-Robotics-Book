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
                import google.generativeai as genai
                if 'google.genai' not in sys.modules:
                    sys.modules['google.genai'] = genai
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
            self.run_config = backend_module.run_config
            self.query_pinecone = backend_module.query_pinecone
            self.input_guardrail_function = backend_module.input_guardrail_function
            self.Runner = backend_module.Runner
            self.InputGuardrailTripwireTriggered = backend_module.InputGuardrailTripwireTriggered

        except ImportError as e:
            raise RuntimeError(f"Failed to import existing agent components: {e}")
        except AttributeError as e:
            raise RuntimeError(f"Required agent components not found in backend module: {e}")

    async def process_message_with_agent(self, message: str, session_id: str, conversation_history: List[ChatHistoryEntry]):
        """
        Process a user message with the existing agent
        """
        try:
            # Run the agent with the user's message
            # For now, we'll run the agent synchronously since the existing agent uses sync runner
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                None,
                self._run_agent_sync,
                message
            )

            # Return the response
            response_obj = type('ResponseObject', (), {})()
            response_obj.response = result.final_output
            response_obj.sessionId = session_id
            response_obj.blocked = False  # Will be set if guardrail triggers

            return response_obj

        except Exception as e:
            # Check if it's a guardrail exception
            if self.InputGuardrailTripwireTriggered and isinstance(e, self.InputGuardrailTripwireTriggered):
                response_obj = type('ResponseObject', (), {})()
                if hasattr(e, 'result') and hasattr(e.result, 'output_info'):
                    response_obj.response = e.result.output_info
                else:
                    response_obj.response = "Request blocked by content guardrail"
                response_obj.sessionId = session_id
                response_obj.blocked = True

                return response_obj
            else:
                # Handle other errors
                response_obj = type('ResponseObject', (), {})()
                response_obj.response = f"Sorry, I encountered an error processing your request: {str(e)}"
                response_obj.sessionId = session_id
                response_obj.blocked = False

                return response_obj

    def _run_agent_sync(self, message: str):
        """
        Run the agent synchronously (wrapper for the existing agent)
        """
        # Import and reload the backend module to ensure we have the latest version
        import importlib.util
        import sys

        # Find the backend file - same logic as in __init__
        possible_paths = [
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
            import google.generativeai as genai
            if 'google.genai' not in sys.modules:
                sys.modules['google.genai'] = genai
        except ImportError:
            pass

        spec = importlib.util.spec_from_file_location("backend", str(backend_file))
        backend_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(backend_module)

        result = backend_module.Runner.run_sync(
            starting_agent=backend_module.agent,
            input=message,
            run_config=backend_module.run_config
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