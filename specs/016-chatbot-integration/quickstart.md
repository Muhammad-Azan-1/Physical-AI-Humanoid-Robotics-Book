# Quickstart: Physical AI & Humanoid Robotics Book Chatbot Integration

## Prerequisites
- Python 3.11+
- Node.js 20+
- Redis server
- Docusaurus project set up

## Backend Setup

1. **Install dependencies:**
   ```bash
   pip install fastapi uvicorn python-multipart pydantic redis openai pinecone-sdk
   ```

2. **Set environment variables:**
   ```bash
   export GEMINI_API_KEY="your-gemini-api-key"
   export PINECONE_API_KEY="your-pinecone-api-key"
   export REDIS_URL="redis://localhost:6379"
   export CORS_ORIGINS="http://localhost:3000"  # Your frontend domain
   ```

3. **Run the backend server:**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

## Frontend Integration

1. **Install chatbot component in your Docusaurus project:**
   ```bash
   # The chatbot component will be available globally once added
   ```

2. **Configure the API endpoint:**
   ```javascript
   // In your environment variables or config
   REACT_APP_API_URL=http://localhost:8000
   ```

## Testing the Integration

1. **Test the API directly:**
   ```bash
   curl -X POST http://localhost:8000/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "What is physical AI?", "sessionId": null}'
   ```

2. **Verify the chatbot appears on your Docusaurus pages**
3. **Test multi-turn conversations to ensure session persistence**

## Environment Variables

Required:
- `GEMINI_API_KEY`: API key for Gemini service
- `PINECONE_API_KEY`: API key for Pinecone vector database
- `REDIS_URL`: Connection string for Redis server

Optional:
- `CORS_ORIGINS`: Comma-separated list of allowed origins
- `API_PORT`: Port for the FastAPI server (default: 8000)
- `SESSION_EXPIRY_HOURS`: Session expiration time in hours (default: 24)