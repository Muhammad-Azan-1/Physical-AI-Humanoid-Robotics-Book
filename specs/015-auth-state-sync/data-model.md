# Data Model: Authentication State Synchronization

## Entities

### AuthenticationState
Represents the current authentication status of a user session
- **id**: string (user ID from auth provider)
- **email**: string (user's email address)
- **emailVerified**: boolean (whether email has been verified)
- **accessToken**: string (JWT access token, stored in HTTP-only cookie)
- **refreshToken**: string (refresh token, stored in HTTP-only cookie)
- **expiresAt**: number (timestamp when access token expires)
- **createdAt**: number (timestamp when session was created)
- **lastSync**: number (timestamp of last cross-tab sync)

### VerificationToken
Represents a temporary token for email verification
- **token**: string (unique verification token)
- **userId**: string (ID of user to verify)
- **expiresAt**: number (timestamp when token expires, 5 minutes from creation)
- **createdAt**: number (timestamp when token was created)
- **used**: boolean (whether token has been used)

### CrossTabMessage
Represents a message sent between browser tabs for synchronization
- **type**: string (message type: 'AUTH_UPDATE', 'LOGOUT', 'TOKEN_EXPIRED')
- **data**: object (payload specific to message type)
- **timestamp**: number (when message was created)
- **sourceTabId**: string (unique ID of tab that sent message)

## State Transitions

### Authentication State Transitions
```
UNAUTHENTICATED -> AUTHENTICATING -> AUTHENTICATED -> LOGGING_OUT -> UNAUTHENTICATED
                                    ↓
                              AUTH_TOKEN_EXPIRED
                                    ↓
                              UNAUTHENTICATED
```

### Verification State Transitions
```
EMAIL_UNVERIFIED -> EMAIL_VERIFICATION_SENT -> EMAIL_VERIFIED -> AUTHENTICATED
```

## Validation Rules

### AuthenticationState Validation
- email must be a valid email format
- accessToken and refreshToken must be non-empty when authenticated
- expiresAt must be in the future when authenticated
- id must match the authenticated user

### VerificationToken Validation
- token must be unique across all tokens
- expiresAt must be within 5 minutes of creation
- token must not be used more than once
- userId must correspond to a valid user account

### CrossTabMessage Validation
- type must be one of the allowed message types
- timestamp must be recent (within 1 minute)
- sourceTabId should be unique per tab instance