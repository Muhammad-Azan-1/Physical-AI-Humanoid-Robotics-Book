# Data Model: Authentication Issues Fix

## Overview
This data model describes the entities and state structures involved in fixing the authentication issues. The changes primarily affect the authentication state management and URL handling rather than introducing new data entities.

## Authentication State Entity

### AuthState
Represents the current authentication status of a user

**Fields**:
- `user` (object | null): User object containing user details (id, email, etc.) when authenticated
- `isAuthenticated` (boolean): Whether the user is currently authenticated
- `isLoading` (boolean): Whether authentication state is being determined
- `error` (string | null): Error message if authentication failed

**State Transitions**:
- `loading` → `authenticated` (when auth confirmed)
- `loading` → `unauthenticated` (when no active session)
- `authenticated` → `unauthenticated` (when signing out)
- `unauthenticated` → `authenticated` (when signing in)

**Validation Rules**:
- `user` field must be null when `isAuthenticated` is false
- `error` field should be cleared when state changes to authenticated

## URL Management Entities

### RedirectURL
The target URL to which users should be redirected after authentication actions

**Fields**:
- `url` (string): The destination URL
- `isValid` (boolean): Whether the URL is valid and safe to redirect to
- `isInternal` (boolean): Whether the URL is internal to the application

**Validation Rules**:
- Must start with `/` to be considered internal
- Must not contain protocol or domain to prevent open redirects
- Should have a valid URL format

### ReturnURL
The original page URL that users were browsing before navigating to authentication

**Fields**:
- `url` (string): The original URL before auth navigation
- `hasQueryParams` (boolean): Whether the original URL had query parameters
- `isPublicPage` (boolean): Whether the original page was a public page

**Validation Rules**:
- Must be a valid internal URL
- Should not be an authentication page to prevent loops
- Must preserve original query parameters when possible

## Session Management

### SessionData
Information stored about the current user session

**Fields**:
- `accessToken` (string): JWT access token from Supabase
- `refreshToken` (string): Refresh token for token renewal
- `expiresAt` (number): Unix timestamp when access token expires
- `provider` (string): Authentication provider (e.g., 'email', 'google')

**Validation Rules**:
- `expiresAt` must be in the future for valid sessions
- `accessToken` and `refreshToken` must not be empty when session is active

## UI State Entities

### SignOutState
State for managing the sign out confirmation flow

**Fields**:
- `showConfirmation` (boolean): Whether to show the confirmation dialog
- `isProcessing` (boolean): Whether the sign out process is ongoing
- `showSuccessMessage` (boolean): Whether to show the success notification

**State Transitions**:
- `idle` → `showConfirmation` (when sign out button clicked)
- `showConfirmation` → `isProcessing` (when user confirms)
- `isProcessing` → `success` (when sign out completes)
- `success` → `idle` (after redirect)

### VerificationState
State for managing email verification flow

**Fields**:
- `isVerifying` (boolean): Whether verification is in progress
- `verificationComplete` (boolean): Whether email verification is complete
- `showSuccessMessage` (boolean): Whether to show verification success
- `redirectAfterVerification` (boolean): Whether to redirect after verification

**Validation Rules**:
- `verificationComplete` should trigger automatic authentication flow
- Success message should be shown only once per verification