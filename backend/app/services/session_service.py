import redis.asyncio as redis
import json
import uuid
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from ..models.session import ChatHistoryEntry, SessionData
from ..core.config import settings


class SessionService:
    """
    Service for managing chat sessions with Redis storage
    """

    def __init__(self):
        self.redis_client = redis.from_url(settings.REDIS_URL)
        self.session_expiry = timedelta(hours=settings.SESSION_EXPIRY_HOURS)

    async def create_session(self, initial_message: Optional[str] = None) -> str:
        """
        Create a new session with a unique ID
        """
        session_id = str(uuid.uuid4())
        now = datetime.utcnow()
        expires_at = now + self.session_expiry

        session_data = {
            "sessionId": session_id,
            "createdAt": now.isoformat(),
            "lastActiveAt": now.isoformat(),
            "expiresAt": expires_at.isoformat(),
            "messages": []
        }

        # Add initial message if provided
        if initial_message:
            initial_msg = {
                "id": str(uuid.uuid4()),
                "role": "user",
                "content": initial_message,
                "timestamp": now.isoformat(),
                "status": "sent"
            }
            session_data["messages"].append(initial_msg)

        await self.redis_client.setex(
            f"session:{session_id}",
            int(self.session_expiry.total_seconds()),
            json.dumps(session_data)
        )

        return session_id

    async def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve session data from Redis
        """
        session_data = await self.redis_client.get(f"session:{session_id}")
        if session_data:
            return json.loads(session_data)
        return None

    async def save_message_to_session(self, session_id: str, role: str, content: str):
        """
        Add a message to the session's message history
        """
        session_data = await self.get_session(session_id)
        if not session_data:
            # Create a new session if one doesn't exist
            session_data = {
                "sessionId": session_id,
                "createdAt": datetime.utcnow().isoformat(),
                "lastActiveAt": datetime.utcnow().isoformat(),
                "expiresAt": (datetime.utcnow() + self.session_expiry).isoformat(),
                "messages": []
            }

        # Add the new message
        message = {
            "id": str(uuid.uuid4()),
            "role": role,
            "content": content,
            "timestamp": datetime.utcnow().isoformat(),
            "status": "sent"
        }

        session_data["messages"].append(message)
        session_data["lastActiveAt"] = datetime.utcnow().isoformat()
        session_data["expiresAt"] = (datetime.utcnow() + self.session_expiry).isoformat()

        await self.redis_client.setex(
            f"session:{session_id}",
            int(self.session_expiry.total_seconds()),
            json.dumps(session_data)
        )

    async def get_conversation_history(self, session_id: str, limit: int = 50) -> List[ChatHistoryEntry]:
        """
        Get the conversation history for a session
        """
        session_data = await self.get_session(session_id)
        if session_data:
            # Return the last 'limit' messages
            messages = session_data.get("messages", [])
            # Convert to ChatHistoryEntry objects
            history = []
            for msg in messages[-limit:]:  # Return last N messages
                history.append(ChatHistoryEntry(
                    role=msg["role"],
                    content=msg["content"],
                    timestamp=msg["timestamp"],
                    status=msg.get("status", "sent")
                ))
            return history
        return []

    async def update_session_activity(self, session_id: str):
        """
        Update the last active time for a session
        """
        session_data = await self.get_session(session_id)
        if session_data:
            session_data["lastActiveAt"] = datetime.utcnow().isoformat()
            session_data["expiresAt"] = (datetime.utcnow() + self.session_expiry).isoformat()

            await self.redis_client.setex(
                f"session:{session_id}",
                int(self.session_expiry.total_seconds()),
                json.dumps(session_data)
            )

    async def delete_session(self, session_id: str):
        """
        Delete a session from Redis
        """
        await self.redis_client.delete(f"session:{session_id}")

    async def get_session_messages_count(self, session_id: str) -> int:
        """
        Get the number of messages in a session
        """
        session_data = await self.get_session(session_id)
        if session_data:
            return len(session_data.get("messages", []))
        return 0

    async def extend_session_expiry(self, session_id: str):
        """
        Extend the expiry time of a session by the standard duration
        """
        session_data = await self.get_session(session_id)
        if session_data:
            session_data["lastActiveAt"] = datetime.utcnow().isoformat()
            session_data["expiresAt"] = (datetime.utcnow() + self.session_expiry).isoformat()

            await self.redis_client.setex(
                f"session:{session_id}",
                int(self.session_expiry.total_seconds()),
                json.dumps(session_data)
            )