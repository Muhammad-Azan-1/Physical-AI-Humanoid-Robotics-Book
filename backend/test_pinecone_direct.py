import os
import sys
from dotenv import load_dotenv
import google.generativeai as genai
from pinecone import Pinecone
import asyncio

# Load environment variables
load_dotenv()

# Get API keys
API_KEY = os.getenv("GEMINI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

# Configure Google Generative AI
genai.configure(api_key=API_KEY)

# Initialize Pinecone
pc = Pinecone(api_key=PINECONE_API_KEY)

# Connect to the index
index = pc.Index("bookcontentembeddings")

def query_pinecone_direct(query_text, top_k=5):
    """
    Converts user query to a Gemini vector and searches Pinecone.
    Direct version that can be called without agent framework.
    """
    try:
        # 1. Convert User Query to Vector using Gemini
        response = genai.embed_content(
            model="text-embedding-004",
            content=query_text
        )

        # 2. Extract the vector (list of 768 floats)
        query_vector = response['embedding']

        # 3. Search Pinecone
        query_result = index.query(
            vector=query_vector,   # Send the Gemini vector
            top_k=top_k,           # Get top matches
            include_metadata=True  # Get the original text back
        )

        # 4. Extract text from matches
        matches = query_result['matches']
        retrieved_chunks = [match['metadata']['text'] for match in matches]

        return retrieved_chunks

    except Exception as e:
        print(f"❌ Pinecone query failed: {e}")
        return []

# Test the function directly
print("Testing direct Pinecone query...")
result = query_pinecone_direct("What is Physical AI?")
print(f"Number of results: {len(result) if result else 0}")
if result:
    print("First result preview:", result[0][:200] + "...")

    print("\nAll results:")
    for i, chunk in enumerate(result):
        print(f"Result {i+1}: {chunk[:100]}...")
else:
    print("No results found")