import uuid
import re
from typing import Optional


def generate_session_id() -> str:
    """
    Generate a new UUID-based session identifier
    """
    return str(uuid.uuid4())


def validate_session_id(session_id: str) -> bool:
    """
    Validate that a session ID is a properly formatted UUID
    """
    if not session_id or not isinstance(session_id, str):
        return False

    # Check if the session ID matches UUID format
    uuid_pattern = r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    return bool(re.match(uuid_pattern, session_id))


def sanitize_input(text: str) -> str:
    """
    Basic input sanitization to prevent injection attacks
    """
    if not text or not isinstance(text, str):
        return ""

    # Remove potentially dangerous characters/sequences
    sanitized = text.strip()

    # Prevent potential script injection
    sanitized = sanitized.replace("<script", "&lt;script")
    sanitized = sanitized.replace("javascript:", "javascript_blocked:")
    sanitized = sanitized.replace("vbscript:", "vbscript_blocked:")

    return sanitized


def is_valid_message_content(message: str) -> tuple[bool, Optional[str]]:
    """
    Validate message content for safety and appropriateness
    Returns (is_valid, error_message)
    """
    if not message or not message.strip():
        return False, "Message cannot be empty"

    if len(message) > 10000:  # 10k character limit
        return False, "Message exceeds maximum length of 10,000 characters"

    # Check for potentially harmful content
    dangerous_patterns = [
        r'<script[^>]*>.*?</script>',  # Script tags
        r'javascript:',               # JS protocol
        r'vbscript:',                # VBScript protocol
        r'on\w+\s*=',                # Event handlers
    ]

    for pattern in dangerous_patterns:
        if re.search(pattern, message, re.IGNORECASE):
            return False, "Message contains potentially unsafe content"

    return True, None