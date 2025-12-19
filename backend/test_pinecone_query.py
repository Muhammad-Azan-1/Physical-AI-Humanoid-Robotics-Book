import os
from dotenv import load_dotenv
import google.generativeai as genai
from pinecone import Pinecone

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

# Test embedding a query
query_text = "What is Physical AI?"
response = genai.embed_content(
    model="text-embedding-004",
    content=query_text
)
query_vector = response['embedding']

# Query Pinecone
query_result = index.query(
    vector=query_vector,
    top_k=5,
    include_metadata=True
)

print(f"Query: {query_text}")
print(f"Number of matches: {len(query_result['matches'])}")
print("Matches:")
for i, match in enumerate(query_result['matches']):
    print(f"Match {i+1}: {match['metadata']['text'][:100]}...")