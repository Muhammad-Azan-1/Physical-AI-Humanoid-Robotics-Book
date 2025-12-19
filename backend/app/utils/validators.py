import re
from typing import Dict, List, Optional
from ..models.chat import ChatRequest


def validate_user_input(message: str) -> Dict[str, any]:
    """
    Validate user input for the chatbot
    Returns a dictionary with validation results
    """
    result = {
        "valid": True,
        "errors": []
    }

    # Check if message is empty
    if not message or not message.strip():
        result["valid"] = False
        result["errors"].append("Message cannot be empty")
        return result

    # Check message length
    if len(message) > 10000:  # 10k character limit
        result["valid"] = False
        result["errors"].append("Message exceeds maximum length of 10,000 characters")

    # Check for potentially harmful content
    dangerous_patterns = [
        r'<script[^>]*>.*?</script>',  # Script tags
        r'javascript:',               # JS protocol
        r'vbscript:',                # VBScript protocol
        r'on\w+\s*=',                # Event handlers
    ]

    for pattern in dangerous_patterns:
        if re.search(pattern, message, re.IGNORECASE):
            result["valid"] = False
            result["errors"].append("Message contains potentially unsafe content")
            break

    return result


def validate_session_id_format(session_id: str) -> bool:
    """
    Validate that a session ID is in proper UUID format
    """
    if not session_id or not isinstance(session_id, str):
        return False

    # UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    uuid_pattern = r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    return bool(re.match(uuid_pattern, session_id))


def validate_chat_request(request: ChatRequest) -> Dict[str, any]:
    """
    Validate a chat request object
    Returns a dictionary with validation results
    """
    result = {
        "valid": True,
        "errors": []
    }

    # Validate message
    message_validation = validate_user_input(request.message)
    if not message_validation["valid"]:
        result["valid"] = False
        result["errors"].extend(message_validation["errors"])

    # Validate session ID format if provided
    if request.sessionId:
        if not validate_session_id_format(request.sessionId):
            result["valid"] = False
            result["errors"].append("Session ID must be a valid UUID format")

    return result


def sanitize_text(text: str) -> str:
    """
    Sanitize text input to prevent injection attacks
    """
    if not text or not isinstance(text, str):
        return ""

    # Strip whitespace
    sanitized = text.strip()

    # Replace potentially dangerous content
    dangerous_sequences = [
        ("<script", "&lt;script"),
        ("javascript:", "javascript_blocked:"),
        ("vbscript:", "vbscript_blocked:"),
        ("<iframe", "&lt;iframe"),
        ("onerror=", "onerror_blocked="),
        ("onload=", "onload_blocked="),
    ]

    for dangerous, safe in dangerous_sequences:
        sanitized = sanitized.replace(dangerous, safe)

    return sanitized


def is_safe_content(text: str) -> bool:
    """
    Check if content is safe from common injection patterns
    """
    if not text:
        return True

    dangerous_patterns = [
        r'<script[^>]*>.*?</script>',
        r'<iframe[^>]*>.*?</iframe>',
        r'javascript:',
        r'vbscript:',
        r'on\w+\s*=',
        r'<svg[^>]*onload=',
        r'data:text/html',
    ]

    for pattern in dangerous_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            return False

    return True