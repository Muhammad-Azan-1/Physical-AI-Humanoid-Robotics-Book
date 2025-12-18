---
id: 0002
title: authentication-issues-plan
stage: plan
date: 2025-12-16
surface: agent
model: claude-haiku-4-5-20251001
feature: 014-fix-authentication-issues
branch: 014-fix-authentication-issues
user: Muhammad-Azan
command: /sp.plan
labels: ["authentication", "planning", "ux", "security"]
links:
  spec: specs/014-fix-authentication-issues/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/014-fix-authentication-issues/plan.md
 - specs/014-fix-authentication-issues/research.md
 - specs/014-fix-authentication-issues/data-model.md
 - specs/014-fix-authentication-issues/quickstart.md
tests:
 - specs/014-fix-authentication-issues/research.md
 - specs/014-fix-authentication-issues/data-model.md
---

## Prompt

$ARGUMENTS

## Response snapshot

# Implementation Plan: Fix Authentication Issues

**Branch**: `014-fix-authentication-issues` | **Date**: 2025-12-16 | **Spec**: specs/014-fix-authentication-issues/spec.md

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Fix critical authentication bugs and improve UX for email verification flow, sign-out functionality, state management across browser windows, and redirect/return URL handling. Based on research, implement cross-window auth state synchronization using localStorage events, add sign-out confirmation with feedback, validate redirect URLs to prevent 404 errors, and capture return URLs to preserve user browsing context.

## Technical Context

**Language/Version**: TypeScript 5.6.2, JavaScript ES2022
**Primary Dependencies**: @supabase/supabase-js (v2.45.3), React 19, Docusaurus 3.9.2, @docusaurus/core, @docusaurus/preset-classic
**Storage**: PostgreSQL (via Supabase), HTTP-only cookies for session management
**Testing**: Jest, @testing-library/react, Playwright for E2E testing
**Target Platform**: Web application (SSR/SSG with client-side hydration)
**Project Type**: Web application (Docusaurus-based documentation site with authentication)
**Performance Goals**: <200ms p95 auth operations, fast page load times with authentication state persistence
**Constraints**: Must work with Docusaurus framework, authentication state sync across browser windows/tabs, secure session management
**Scale/Scope**: Educational platform with expected 1000-10000 users

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Constitutional Alignment**: The authentication fixes align with the educational platform goals by improving user experience for students accessing the Physical AI & Humanoid Robotics content.

**Humanoid Prerequisites**: N/A - This is an authentication feature, not directly related to humanoid robotics content, but supports platform accessibility.

**Natural Interaction**: N/A - Authentication UX improvement, not voice/NLP related.

**Platform Research**: Confirmed using Supabase for authentication with Docusaurus 3.9.2, which is stable and appropriate for the platform.

**Safety-Critical**: Not safety-critical in the humanoid robotics sense, but security-critical for user data protection.

**Technical Implementation**:
- ✅ Context 7 MCP State Validated: Docusaurus structure verified via file system exploration
- ✅ Supabase integration confirmed to be in place
- ✅ React 19 + TypeScript 5.6.2 confirmed as current stack

**Compliance Status**: All constitutional requirements satisfied for web authentication enhancement.

## Project Structure

### Documentation (this feature)

```text
specs/014-fix-authentication-issues/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
physical-ai-book/
├── src/
│   ├── components/
│   │   ├── auth/                    # Authentication UI components
│   │   ├── AuthenticationAwareNavbar/ # Auth-aware navigation
│   │   └── UserProfileNavbarItem.tsx # User profile in navbar
│   ├── contexts/
│   │   └── AuthContext.tsx          # Authentication state management
│   ├── pages/
│   │   ├── signin.tsx               # Sign in page
│   │   ├── signup.tsx               # Sign up page
│   │   ├── profile.tsx              # User profile page
│   │   └── reset-password.tsx       # Password reset page
│   ├── services/
│   │   └── supabase.ts              # Supabase client and auth services
│   ├── utils/
│   │   ├── authHelpers.ts            # Authentication helper functions
│   │   └── auth-utils.ts             # Additional auth utilities
│   └── theme/
│       └── NavbarItem/               # Custom navbar implementation
├── tests/                            # Test files for auth functionality
└── docusaurus.config.ts              # Docusaurus configuration
```

**Structure Decision**: This is a web application using Docusaurus with React components for authentication. The authentication implementation is already in place using Supabase, and we're enhancing the existing auth flow with better UX, state synchronization, and redirect handling.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

# Research: Authentication Issues Fix

## Overview
This research addresses the four critical authentication issues identified in the feature specification:
1. Email verification flow and state sync problems
2. Silent sign out with no feedback
3. Wrong URL after signin (404 errors)
4. Return URL functionality not working

## Decision: Authentication State Synchronization Across Browser Windows
**Rationale**: The primary challenge is ensuring authentication state is synchronized across browser windows/tabs. Supabase provides built-in auth state listeners, but browser windows don't automatically sync state changes.

**Solution Approach**:
- Use Supabase's `onAuthStateChange` listener to detect authentication changes
- Implement `BroadcastChannel API` or `localStorage` events to communicate auth state changes between windows
- Update the AuthContext in all windows when a change occurs in any window

**Alternatives Considered**:
1. Server-side polling - Rejected due to performance impact and unnecessary complexity
2. WebSocket connections - Overkill for this use case
3. localStorage events - Simpler and more appropriate for same-origin cross-window communication

## Decision: Sign Out UX Implementation
**Rationale**: Users need clear feedback and confirmation before signing out to prevent accidental signouts.

**Solution Approach**:
- Implement a modal confirmation dialog using React state
- Add loading state during signout process
- Show toast notification after successful signout
- Redirect to signin page after confirmation

**Alternatives Considered**:
1. Simple "Are you sure?" alert - Less user-friendly than custom modal
2. Immediate signout with undo option - Risky for security-sensitive operations
3. Snackbar with action - Good but doesn't prevent accidental clicks as effectively

## Decision: Redirect URL Validation
**Rationale**: Prevent 404 errors and security vulnerabilities from malformed or external redirect URLs.

**Solution Approach**:
- Validate redirect URLs to ensure they're internal to the application
- Implement fallback to default route for invalid URLs
- Sanitize and verify URL format before navigation

**Alternatives Considered**:
1. Allow any redirect - Security risk (open redirect vulnerability)
2. No redirect validation - Would result in 404 errors as currently experienced
3. Server-side validation - Not applicable for client-side routing

## Decision: Return URL Capture and Handling
**Rationale**: Preserve user's browsing context when they initiate authentication from public pages.

**Solution Approach**:
- Capture current URL before navigation to auth pages using query parameters
- Store in URL parameters (e.g., `?returnUrl=/docs/module4`)
- Read and validate return URL after successful authentication
- Redirect to return URL or default if none provided

**Alternatives Considered**:
1. Session storage - Could be cleared during auth flow
2. Local storage - More complex to manage
3. URL parameters - Simplest and most reliable approach for this use case

## Technical Implementation Details

### Supabase Auth State Management
- Current implementation uses `AuthContext` with React hooks
- Need to enhance with cross-window communication
- Use `onAuthStateChange` listener to detect changes from other windows

### Browser Storage Options for Cross-Window Communication
- `localStorage` with event listeners is the most compatible solution
- When auth state changes in one window, update localStorage
- Other windows listen for `storage` events and update their state accordingly

### URL Validation Strategy
- Only allow internal URLs starting with `/`
- Validate URL format and prevent open redirect vulnerabilities
- Implement proper fallback mechanism for invalid URLs

### Testing Considerations
- Cross-window state sync is difficult to test automatically
- Manual testing will be required for multi-window scenarios
- Focus on unit tests for individual components and integration tests for auth flows

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

# Quickstart: Authentication Issues Fix

## Overview
This guide explains how to implement the fixes for authentication issues including email verification flow, sign out UX, redirect URL validation, and return URL functionality.

## Prerequisites
- Node.js >= 20.0
- Yarn or npm
- Docusaurus 3.9.2 project with Supabase authentication
- TypeScript 5.6.2

## Setup

### 1. Environment Configuration
Ensure your Supabase environment is properly configured:

```bash
# In your .env file
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Install Dependencies
```bash
cd physical-ai-book
npm install @supabase/supabase-js react-hot-toast (or your preferred toast library)
```

## Implementation Steps

### 1. Update AuthContext for Cross-Window Sync
Modify `src/contexts/AuthContext.tsx` to include cross-window communication:

```typescript
// Add localStorage event listener for cross-window auth sync
useEffect(() => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'auth-state') {
      // Update auth state when it changes in another window
      const newState = JSON.parse(e.newValue || 'null');
      if (newState) {
        setCurrentUser(newState.user);
        setIsAuthenticated(newState.isAuthenticated);
      }
    }
  };

  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);
```

### 2. Implement Sign Out Confirmation Dialog
Create a confirmation dialog component for sign out:

```typescript
// In your sign out handler
const handleSignOut = async () => {
  const confirmed = window.confirm('Are you sure you want to sign out?');
  if (confirmed) {
    try {
      await supabase.auth.signOut();
      // Show success toast
      toast.success('You\'ve been signed out successfully');
      // Redirect to sign in page
      navigate('/signin');
    } catch (error) {
      toast.error('Failed to sign out. Please try again');
    }
  }
};
```

### 3. Add Redirect URL Validation
Create a utility function to validate redirect URLs:

```typescript
// In src/utils/authHelpers.ts
export const isValidRedirectUrl = (url: string): boolean => {
  try {
    // Only allow internal URLs
    if (!url || !url.startsWith('/')) return false;

    // Prevent open redirect vulnerabilities
    if (url.includes('://') || url.startsWith('//')) return false;

    // Prevent loops to auth pages
    if (url.includes('/signin') || url.includes('/signup')) return false;

    return true;
  } catch {
    return false;
  }
};
```

### 4. Implement Return URL Capture
Update auth navigation to capture and handle return URLs:

```typescript
// When navigating to auth pages, preserve current location
const currentPath = window.location.pathname + window.location.search;
const authUrl = `/signin?returnUrl=${encodeURIComponent(currentPath)}`;

// After successful authentication, use return URL
const returnUrl = new URLSearchParams(location.search).get('returnUrl');
const redirectUrl = returnUrl && isValidRedirectUrl(decodeURIComponent(returnUrl))
  ? decodeURIComponent(returnUrl)
  : '/dashboard';

navigate(redirectUrl);
```

## Testing

### Manual Testing Required
- Cross-window authentication state sync (open multiple browser windows/tabs)
- Email verification flow in different window scenarios
- Sign out confirmation flow
- Redirect URL validation with various inputs
- Return URL functionality from different pages

### Automated Testing
- Unit tests for URL validation functions
- Integration tests for auth state management
- Component tests for confirmation dialogs

## Files to Modify
- `src/contexts/AuthContext.tsx` - Add cross-window sync
- `src/components/auth/SignOutButton.tsx` - Add confirmation flow
- `src/utils/authHelpers.ts` - Add URL validation utilities
- `src/pages/signin.tsx` and `src/pages/signup.tsx` - Handle return URLs
- `src/services/supabase.ts` - Update auth listeners if needed

## Rollback Plan
If issues occur:
1. Remove cross-window sync code from AuthContext
2. Revert sign out flow to original implementation
3. Remove URL validation and return to original redirect logic

## Outcome

- ✅ Impact: Comprehensive plan created for fixing authentication issues with research, data models, and implementation guide
- 🧪 Tests: Identified manual and automated testing approaches for cross-window functionality
- 📁 Files: Created plan.md, research.md, data-model.md, and quickstart.md
- 🔁 Next prompts: Ready for task generation (/sp.tasks) and implementation
- 🧠 Reflection: Plan addresses all four authentication issues with appropriate technical solutions

## Evaluation notes (flywheel)

- Failure modes observed: Cross-window state sync is complex to test automatically
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Generate tasks for implementation
