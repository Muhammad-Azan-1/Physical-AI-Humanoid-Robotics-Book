import os
import sys
from dotenv import load_dotenv
import google.generativeai as genai
from pinecone import Pinecone, ServerlessSpec
from uuid import uuid4

# Add the src directory to the path to access the backend module
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

# Load environment variables
load_dotenv()

# Get API keys
API_KEY = os.getenv("GEMINI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")

if not API_KEY:
    print("GEMINI_API_KEY not found in environment variables")
    exit(1)

if not PINECONE_API_KEY:
    print("PINECONE_API_KEY not found in environment variables")
    exit(1)

# Configure Google Generative AI
genai.configure(api_key=API_KEY)

# Initialize Pinecone
pc = Pinecone(api_key=PINECONE_API_KEY)

# Index name
index_name = "bookcontentembeddings"

# Create index if it doesn't exist
if index_name not in pc.list_indexes().names():
    print(f"Creating index: {index_name}")
    pc.create_index(
        name=index_name,
        spec=ServerlessSpec(cloud='aws', region='us-east-1'),
        dimension=768  # Gemini embedding dimension
    )
else:
    print(f"Index {index_name} already exists")

# Connect to the index
index = pc.Index(index_name)

def text_into_chunks(text, maxlen=100):
    """
    Splits the text into chunks of `maxlen` words.
    """
    chunks = []
    words_list = text.split()
    for i in range(0, len(words_list), maxlen):
        chunk = " ".join(words_list[i:i+maxlen])
        chunks.append(chunk)
    return chunks

def upload_book_to_pinecone(file_name="book-content.md"):
    """
    Reads the book content, chunks it, embeds it using Gemini,
    and uploads vectors to Pinecone.
    """
    print("--- Starting Book Upload Process ---")

    # Construct file path
    content_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), file_name)

    # Check if file exists
    if not os.path.exists(content_path):
        print(f"❌ Error: Content file not found at {content_path}")
        return

    # Read content
    with open(content_path, "r", encoding="utf-8") as f:
        content = f.read()

    chunks_list = text_into_chunks(content)
    print(f"✅ Loaded {len(chunks_list)} chunks from file.")

    # Embed and upsert
    batch_limit = 100
    vectors_to_upsert = []

    try:
        print("Starting embedding and upload...")
        for i, chunk in enumerate(chunks_list):

            # Generate embedding using Gemini
            response = genai.embed_content(
                model="text-embedding-004",
                content=chunk
            )

            # Extract the embedding vector
            embedding_vector = response['embedding']
            vector_id = str(uuid4())

            # Prepare record for Pinecone
            vectors_to_upsert.append((vector_id, embedding_vector, {'text': chunk}))

            # Batch upsert
            if len(vectors_to_upsert) >= batch_limit:
                index.upsert(vectors_to_upsert)
                vectors_to_upsert = []  # Reset batch
                print(f"Batch saved. Progress: {i+1}/{len(chunks_list)}")

        # Final batch
        if vectors_to_upsert:
            index.upsert(vectors_to_upsert)
            print("Final batch saved.")

        print("🎉 Success: All data saved in Pinecone.")

    except Exception as e:
        print(f"❌ Error during upload: {e}")

if __name__ == "__main__":
    upload_book_to_pinecone()