import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

# Import the backend module directly to test the agent
from backend import agent, run_config, Runner, query_pinecone

# Test the query_pinecone function directly
print("Testing query_pinecone function directly...")
result = query_pinecone("What is Physical AI?")
print(f"Query result: {result}")
print(f"Number of results: {len(result) if result else 0}")

# Test the agent with the query
print("\nTesting agent with the query...")
try:
    result = Runner.run_sync(
        starting_agent=agent,
        input="What is Physical AI?",
        run_config=run_config
    )
    print(f"Agent response: {result.final_output}")
except Exception as e:
    print(f"Error running agent: {e}")
    import traceback
    traceback.print_exc()