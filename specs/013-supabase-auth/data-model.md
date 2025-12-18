# Data Model: Supabase Authentication System

## User Entity

**Table**: `users`
- `id` (UUID, Primary Key): Unique identifier for the user
- `email` (TEXT, Unique, Not Null): User's email address (lowercase)
- `password_hash` (TEXT, Not Null): Bcrypt hashed password (min 10 rounds)
- `email_verified` (BOOLEAN, Default: false): Whether the email has been verified
- `verification_token` (UUID, Nullable): Secure random token for email verification
- `verification_expires` (TIMESTAMP, Nullable): Expiration time for verification token (24 hours)
- `created_at` (TIMESTAMP, Not Null): Account creation timestamp
- `updated_at` (TIMESTAMP, Not Null): Last update timestamp
- `last_login` (TIMESTAMP, Nullable): Timestamp of last successful login
- `login_attempts` (INTEGER, Default: 0): Count of consecutive failed login attempts
- `locked_until` (TIMESTAMP, Nullable): Timestamp until which account is locked

## Session Entity

**Table**: `sessions`
- `id` (UUID, Primary Key): Unique session identifier
- `user_id` (UUID, Foreign Key): References user.id
- `token` (TEXT, Not Null): Secure random session token
- `expires_at` (TIMESTAMP, Not Null): Session expiration timestamp
- `created_at` (TIMESTAMP, Not Null): Session creation timestamp
- `ip_address` (TEXT): IP address of the client for security logging
- `user_agent` (TEXT): User agent string for security logging

## Verification Token Entity

**Note**: This is handled by Supabase Auth system internally, but conceptually:
- `token` (UUID): Secure random verification token
- `user_id` (UUID): References user.id
- `expires_at` (TIMESTAMP): Token expiration (24 hours from creation)
- `used` (BOOLEAN, Default: false): Whether token has been used

## Validation Rules

### User Registration
- Email format must be valid (RFC 5322)
- Password must be min 8 characters with 1 uppercase, 1 number, 1 special character
- Email must be unique across all users
- Verification token must be cryptographically secure and unique

### Authentication
- Email verification required before signin
- Account locked after 5 failed login attempts for 30 minutes
- Rate limiting: max 5 auth attempts per minute per IP
- Session tokens must be HTTP-only cookies for security

### Data Integrity
- All timestamps use UTC timezone
- Passwords must be hashed with bcrypt (min 10 rounds)
- Verification tokens expire after 24 hours
- Session tokens expire after 7 days of inactivity