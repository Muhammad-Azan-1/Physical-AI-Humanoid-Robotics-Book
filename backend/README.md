# Physical AI & Humanoid Robotics Book Chatbot Integration - Backend

This is the backend API for the Physical AI & Humanoid Robotics documentation chatbot. The API connects the existing OpenAI Agent (with Pinecone RAG) to the Docusaurus frontend through a FastAPI backend, enabling multi-turn conversations with context awareness.

## Features

- FastAPI-based REST API with proper error handling
- Redis-backed session management for conversation persistence
- Integration with existing OpenAI Agent and Pinecone RAG system
- Input guardrails to ensure questions remain relevant to Physical AI and Humanoid Robotics topics
- Proper CORS configuration for frontend integration
- Complete with rate limiting and security best practices

## Tech Stack

- **Framework**: FastAPI for high-performance API
- **Runtime**: Python 3.11+
- **Package Manager**: Poetry
- **Session Storage**: Redis
- **AI Integration**: OpenAI Agent with Pinecone RAG
- **Environment Management**: python-dotenv

## Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd backend
   ```

2. **Set up a virtual environment:**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install poetry
   poetry install
   ```

4. **Set up environment variables:**
   Create a `.env` file in the backend directory with the following variables:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   PINECONE_API_KEY=your_pinecone_api_key
   REDIS_URL=redis://localhost:6379
   CORS_ORIGINS=http://localhost:3000,http://localhost:3001
   SESSION_EXPIRY_HOURS=24
   ```

## Running the Application

### Development
```bash
poetry run uvicorn app.main:app --reload --port 8000
```

### Production
```bash
poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`.

## API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/chat` - Main chat endpoint for sending messages to the AI agent

## Architecture

The backend consists of:

- **Main Application** (`app/main.py`): FastAPI application with CORS configuration
- **API Routes** (`app/api/v1/chat.py`): Chat endpoint with session management
- **Models** (`app/models/`): Pydantic models for request/response validation
- **Services** (`app/services/`): Business logic for session management and chat processing
- **Core Utilities** (`app/core/`): Configuration and security utilities
- **Utilities** (`app/utils/`): Helper functions and validators

## Environment Variables

- `GEMINI_API_KEY`: API key for Google's Generative AI service
- `PINECONE_API_KEY`: API key for Pinecone vector database
- `REDIS_URL`: Connection string for Redis server (default: redis://localhost:6379)
- `CORS_ORIGINS`: Comma-separated list of allowed origins (default: http://localhost:3000,http://localhost:3001)
- `SESSION_EXPIRY_HOURS`: Number of hours before session expires (default: 24)

## Session Management

The API uses Redis to store conversation sessions with the following characteristics:

- Sessions expire after 24 hours of inactivity (configurable)
- Each session maintains conversation history with timestamps
- Session IDs are UUIDs stored in the client's localStorage
- Session data includes message history and metadata

## Error Handling

The API includes comprehensive error handling with appropriate HTTP status codes:

- 400 Bad Request: Invalid request parameters
- 404 Not Found: Endpoint not found
- 422 Unprocessable Entity: Invalid request format
- 500 Internal Server Error: Unexpected server errors
- 503 Service Unavailable: Downstream services unavailable

## Security

- CORS configured to allow only specified origins
- Input validation on all endpoints
- Session management with secure session IDs
- Guardrails to prevent off-topic questions
- Rate limiting to prevent abuse

## Testing

Run the tests using pytest:

```bash
poetry run pytest
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the tests
6. Submit a pull request

## License

This project is licensed under the MIT License.