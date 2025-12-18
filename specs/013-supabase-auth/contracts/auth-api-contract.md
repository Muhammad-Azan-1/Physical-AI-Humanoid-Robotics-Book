# Authentication API Contracts

## User Registration

### POST /auth/signup
**Description**: Register a new user account

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "confirm_password": "SecurePassword123!"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Verification email sent. Please check your inbox.",
  "user_id": "uuid-string"
}
```

**Response (400)**:
```json
{
  "success": false,
  "error": "Invalid email format",
  "code": "INVALID_EMAIL"
}
```

**Validation**:
- Email must be valid format
- Password must meet requirements (8+ chars, 1 uppercase, 1 number, 1 special)
- Password and confirm_password must match
- Email must not already exist

## User Signin

### POST /auth/signin
**Description**: Authenticate user with email and password

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Authentication successful",
  "redirect_url": "/dashboard" // or original destination
}
```

**Response (401)**:
```json
{
  "success": false,
  "error": "Invalid email or password",
  "code": "INVALID_CREDENTIALS"
}
```

**Response (403)**:
```json
{
  "success": false,
  "error": "Please verify your email address",
  "code": "EMAIL_NOT_VERIFIED"
}
```

## Email Verification

### GET /auth/verify?token={verification_token}
**Description**: Verify user email using token from email

**Response (200)**:
```json
{
  "success": true,
  "message": "Email verified successfully",
  "redirect_to": "/signin"
}
```

**Response (400)**:
```json
{
  "success": false,
  "error": "Invalid or expired verification token",
  "code": "INVALID_TOKEN"
}
```

## Protected Route Access

### GET /auth/check-session
**Description**: Check current authentication status

**Response (200)**:
```json
{
  "authenticated": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

**Response (401)**:
```json
{
  "authenticated": false
}
```

## Session Management

### POST /auth/logout
**Description**: End current user session

**Response (200)**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```