# Data Model: Docusaurus Authentication System

## User Entity
Represents a registered member with credentials, profile information, and account status.

**Fields:**
- id (string/UUID): Unique identifier for the user
- email (string): User's email address (unique, required)
- email_verified (boolean): Whether the email has been verified
- created_at (timestamp): Account creation timestamp
- updated_at (timestamp): Last update timestamp
- role (string): User role (student, instructor, admin) - defaults to 'student'
- profile (object): Nested profile information
  - first_name (string): User's first name
  - last_name (string): User's last name
  - display_name (string): Name displayed publicly
  - avatar_url (string): URL to user's profile picture
  - bio (string): Brief user bio
  - preferences (object): User preferences
    - theme (string): Preferred theme (light/dark)
    - notifications (object): Notification preferences

## Session Entity
Represents an active authentication state with token, expiration, and associated user.

**Fields:**
- id (string/UUID): Unique identifier for the session
- user_id (string/UUID): Reference to the user
- created_at (timestamp): Session creation timestamp
- expires_at (timestamp): Session expiration timestamp
- last_accessed_at (timestamp): Last time session was used
- user_agent (string): Browser/device information
- ip_address (string): IP address of the user

## Role Entity
Defines permissions and access levels for users (e.g., anonymous, registered, premium, admin).

**Fields:**
- name (string): Role identifier (student, instructor, admin)
- permissions (array): List of permissions associated with the role
- created_at (timestamp): Creation timestamp
- updated_at (timestamp): Last update timestamp

## Permission Entity
Specific access rights that determine what content and features a user can access.

**Fields:**
- id (string): Unique permission identifier
- name (string): Permission name (e.g., 'read:premium-content', 'create:course')
- description (string): Human-readable description of the permission
- created_at (timestamp): Creation timestamp

## Profile Entity
User-specific information including preferences, learning progress, and personal details.

**Fields:**
- user_id (string/UUID): Reference to the user
- first_name (string): User's first name
- last_name (string): User's last name
- display_name (string): Name displayed publicly
- avatar_url (string): URL to user's profile picture
- bio (string): Brief user bio
- preferences (object): User preferences
  - theme (string): Preferred theme (light/dark)
  - notifications (object): Notification preferences
- learning_progress (object): Tracking user's learning progress
  - completed_courses (array): List of completed course IDs
  - current_course (string): Currently enrolled course ID
  - achievements (array): List of earned achievements/badges
  - last_accessed_content (string): ID of last accessed content
- created_at (timestamp): Creation timestamp
- updated_at (timestamp): Last update timestamp

## Course/Content Access Entity
Tracks which users have access to which content.

**Fields:**
- id (string/UUID): Unique identifier
- user_id (string/UUID): Reference to the user
- content_id (string): Reference to the content
- access_level (string): Access level (view, edit, admin)
- granted_at (timestamp): When access was granted
- expires_at (timestamp): When access expires (optional)

## Authentication Token Entity
Secure identifier that verifies user identity during session.

**Fields:**
- id (string/UUID): Unique identifier for the token
- user_id (string/UUID): Reference to the user
- token_type (string): Type of token (access, refresh, reset)
- token_hash (string): Hashed token value (for security)
- expires_at (timestamp): Token expiration time
- created_at (timestamp): Creation timestamp
- used_at (timestamp): When token was last used
- revoked (boolean): Whether the token has been revoked
- metadata (object): Additional token metadata

## Validation Rules
- User email must be unique and properly formatted
- User passwords must meet complexity requirements
- Session expiration must be within reasonable timeframes
- Profile display names must not exceed 50 characters
- User roles must be from the defined set of valid roles
- All timestamps must be in ISO 8601 format
- User profile information must be sanitized to prevent XSS

## State Transitions
- User: unverified → verified (via email verification)
- User: active → suspended (by admin action)
- Session: active → expired (via time expiration)
- Token: valid → used/invalid (after single use or expiration)