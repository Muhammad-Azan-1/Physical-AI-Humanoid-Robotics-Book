# Data Model: Physical AI & Humanoid Robotics Book Chatbot Integration

## Session Entity
- **sessionId** (string, UUID): Unique identifier for the conversation session
- **createdAt** (timestamp): Time when session was created
- **lastActiveAt** (timestamp): Time of last activity in session
- **expiresAt** (timestamp): Time when session expires (24 hours after last activity)
- **messages** (array): List of messages in the conversation

## Message Entity
- **id** (string, UUID): Unique identifier for the message
- **sessionId** (string): Reference to the parent session
- **role** (string): "user" or "assistant"
- **content** (string): The text content of the message
- **timestamp** (timestamp): Time when message was created
- **status** (string): "sent", "processing", "error"

## API Request Models

### Chat Request
- **message** (string): User's message content
- **sessionId** (string, optional): Existing session ID, generates new if not provided

### Chat Response
- **response** (string): AI-generated response
- **sessionId** (string): Session ID (existing or newly created)
- **timestamp** (string): Response timestamp
- **blocked** (boolean, optional): Flag if input guardrail was triggered

## API Error Models

### Error Response
- **error** (string): Error message
- **errorCode** (string): Error code (e.g., "INVALID_REQUEST", "GUARDRAIL_BLOCKED", "AGENT_ERROR", "TIMEOUT")
- **details** (string, optional): Additional error details