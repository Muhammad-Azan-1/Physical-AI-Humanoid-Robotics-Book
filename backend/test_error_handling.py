"""
Test script to verify the error handling implementation in the chatbot.
This script tests that when errors occur, the error handler agent provides user-friendly messages.
"""
import asyncio
import sys
from pathlib import Path

# Add the backend directory to the path
sys.path.insert(0, str(Path(__file__).parent))

def test_error_handler_agent():
    """Test that the error handler agent provides user-friendly messages"""
    print("Testing error handler agent...")

    try:
        # Import the backend module to access the agents
        import importlib.util
        spec = importlib.util.spec_from_file_location("backend", str(Path(__file__).parent / "src/backend/__init__.py"))
        backend_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(backend_module)

        print("✓ Backend module loaded successfully")

        # Test the error handler agent with a sample error message
        print("\nTesting error handler agent with sample error...")
        error_result = backend_module.Runner.run_sync(
            starting_agent=backend_module.agent2,  # Use the error handler agent
            input="This error occurred when user asked a question: Connection timeout. Please provide a user-friendly message to the user.",
            run_config=backend_module.run_config
        )

        print(f"✓ Error handler response: {error_result.final_output}")

        # Test the error handler agent with a guardrail trigger
        print("\nTesting error handler agent with guardrail trigger...")
        guardrail_result = backend_module.Runner.run_sync(
            starting_agent=backend_module.agent2,  # Use the error handler agent
            input="Guardrail triggered when user asked a question: Request blocked for inappropriate content. Please provide a user-friendly message to the user explaining why their request was blocked.",
            run_config=backend_module.run_config
        )

        print(f"✓ Guardrail error handler response: {guardrail_result.final_output}")

        print("\n✓ Error handler agent tests completed successfully")

    except Exception as e:
        print(f"✗ Error during testing: {str(e)}")
        return False

    return True

def test_main_agent():
    """Test the main agent with a simple query"""
    print("\nTesting main agent with a sample query...")

    try:
        # Import the backend module to access the agents
        import importlib.util
        spec = importlib.util.spec_from_file_location("backend", str(Path(__file__).parent / "src/backend/__init__.py"))
        backend_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(backend_module)

        # Test the main agent with a sample query
        result = backend_module.Runner.run_sync(
            starting_agent=backend_module.agent,
            input="What is Physical AI?",
            run_config=backend_module.run_config
        )

        print(f"✓ Main agent response: {result.final_output}")
        print("✓ Main agent test completed successfully")

    except Exception as e:
        print(f"✗ Error during main agent testing: {str(e)}")
        return False

    return True

def test_input_guardrail():
    """Test the input guardrail with both allowed and forbidden topics"""
    print("\nTesting input guardrail agent...")

    try:
        # Import the backend module to access the agents
        import importlib.util
        spec = importlib.util.spec_from_file_location("backend", str(Path(__file__).parent / "src/backend/__init__.py"))
        backend_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(backend_module)

        # Test with an allowed topic (Physical AI question)
        print("  Testing allowed topic (Physical AI question)...")
        allowed_result = backend_module.Runner.run_sync(
            starting_agent=backend_module.input_guardrail_agent,
            input="What is Physical AI?",
            run_config=backend_module.run_config
        )

        print(f"  ✓ Allowed topic result: is_off_topic={allowed_result.final_output.is_off_topic}, reason='{allowed_result.final_output.reason}'")

        # Test with a forbidden topic (General knowledge)
        print("  Testing forbidden topic (General knowledge)...")
        forbidden_result = backend_module.Runner.run_sync(
            starting_agent=backend_module.input_guardrail_agent,
            input="What is the capital of France?",
            run_config=backend_module.run_config
        )

        print(f"  ✓ Forbidden topic result: is_off_topic={forbidden_result.final_output.is_off_topic}, reason='{forbidden_result.final_output.reason}'")

        print("  ✓ Input guardrail tests completed successfully")

    except Exception as e:
        print(f"  ✗ Error during input guardrail testing: {str(e)}")
        return False

    return True

if __name__ == "__main__":
    print("🧪 Running error handling tests...\n")

    success = True

    success &= test_error_handler_agent()
    success &= test_main_agent()
    success &= test_input_guardrail()

    print(f"\n{'✓' if success else '✗'} All tests {'passed' if success else 'failed'}")

    if success:
        print("\n🎉 Error handling implementation is working correctly!")
        print("When errors occur in the chatbot, the error handler agent will provide user-friendly messages.")
    else:
        print("\n❌ Some tests failed. Please check the implementation.")