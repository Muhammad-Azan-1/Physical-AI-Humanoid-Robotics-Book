---
id: 1
title: supabase-auth-spec
stage: spec
date: 2025-12-16
surface: agent
model: claude-haiku-4-5-20251001
feature: supabase-auth
branch: 013-supabase-auth
user: Muhammad-Azan
command: sp.specify
labels: [authentication, supabase, specification]
links:
  spec: specs/001-supabase-auth/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-supabase-auth/spec.md
  - specs/001-supabase-auth/checklists/requirements.md
tests:
  - Specification quality checklist completed
---

## Prompt

write a specification for subaspace completed production ready end-to-end implementation use context 7 mcp server to search latest docs about subaspace Specification: Production-Ready Authentication System

Document Information

Spec ID: SPEC-AUTH-001

Date: 2025-12-16

Status: Draft

Priority: Critical

Version: 1.0

1. Executive Summary

Implement a complete, production-ready authentication system with user signup, email verification, signin, and proper flow management. The system must handle all edge cases, provide clear user feedback, and maintain proper redirect flows throughout the authentication journey.

2. Problem Statement

Current State

Authentication system is not working

No proper user signup flow

Email verification is missing or broken

Signin functionality is incomplete

Edge cases are not handled

User experience is poor with unclear error messages

Redirect flows after authentication are not implemented

Desired State

Fully functional signup with email verification

Secure signin with proper validation

Clear, user-friendly error messages for all edge cases

Seamless redirect flows (signup → verify → login → original destination)

Production-ready, secure authentication system

3. User Flows

3.1 Primary Flow: New User Registration

1. User visits signup page

2. User enters: email, password, confirm password

3. System validates input

4. System creates account

5. System sends verification email

6. User receives email with verification link

7. User clicks verification link

8. System verifies email

9. User is redirected to login/signin page

10. User enters credentials

11. System authenticates user

12. User is redirected to original destination home page

3.2 Returning User Flow

1. User visits sign-in page (or is redirected from protected route)

2. User enters: email, password

3. System validates credentials

4. System checks email verification status

5. User is authenticated

6. User is redirected to:

   - Original protected page they tried to access, OR

   - home if direct login

3.3 Email Verification Flow

1. User signs up successfully

2. System sends verification email immediately

3. User clicks verification link in email

4. System validates token and marks email as verified

5. User sees success message

6. User is redirected to login page with success notification

7. User can now sign in

4. Functional Requirements

4.1 Signup Requirements

IDRequirementPriorityFR-S-001User must provide valid email addressCriticalFR-S-002User must provide password (min 8 characters, 1 uppercase, 1 number, 1 special char)CriticalFR-S-003User must confirm password (must match password field)CriticalFR-S-004System must validate email format before submissionCriticalFR-S-005System must check if email already exists before creating accountCriticalFR-S-006System must send verification email immediately after signupCriticalFR-S-007System must show clear success message after signupHighFR-S-008System must inform user to check email for verificationHighFR-S-009Signup form must have loading state during submissionMediumFR-S-010System must prevent duplicate signups while request is processingHigh4.2 Email Verification Requirements

IDRequirementPriorityFR-V-001System must generate secure, unique verification tokenCriticalFR-V-002Verification token must expire after 24 hoursCriticalFR-V-003Verification email must contain clear call-to-action button/linkCriticalFR-V-004System must validate token on verification link clickCriticalFR-V-005System must mark email as verified after successful validationCriticalFR-V-006System must redirect to login page after successful verificationCriticalFR-V-007System must show success message after verificationHighFR-V-008System must handle expired tokens gracefullyHighFR-V-009System must allow resending verification emailMediumFR-V-010System must prevent already-verified emails from re-verifyingMedium4.3 Signin Requirements

IDRequirementPriorityFR-I-001User must provide email and passwordCriticalFR-I-002System must validate credentials against databaseCriticalFR-I-003System must check if email is verified before allowing signinCriticalFR-I-004System must create session after successful authenticationCriticalFR-I-005System must redirect authenticated users to intended destinationCriticalFR-I-006System must store "return URL" before redirecting to loginCriticalFR-I-007System must redirect to dashboard if no return URL existsHighFR-I-008Signin form must have loading state during authenticationMediumFR-I-009System must implement rate limiting to prevent brute forceHighFR-I-010System must lock account after 5 failed login attemptsMedium4.4 Session Management Requirements

IDRequirementPriorityFR-M-001System must persist session across page refreshesCriticalFR-M-002System must validate session on protected routesCriticalFR-M-003System must redirect unauthenticated users to loginCriticalFR-M-004System must store return URL when redirecting to loginCriticalFR-M-005Session must expire after 7 days of inactivityHighFR-M-006System must refresh session token before expirationHighFR-M-007System must provide "Remember Me" option (30 day session)MediumFR-M-008System must handle concurrent sessions properlyMedium5. Edge Cases & Error Handling

5.1 Signup Edge Cases

ScenarioExpected BehaviorError MessageEmail already existsReject signup, show error"An account with this email already exists. Please sign in or use a different email."Invalid email formatReject signup, show error"Please enter a valid email address."Weak passwordReject signup, show error"Password must be at least 8 characters with 1 uppercase letter, 1 number, and 1 special character."Passwords don't matchReject signup, show error"Passwords do not match. Please try again."Email service failsRetry, then show error"We couldn't send the verification email. Please try again later."Network error during signupShow error, allow retry"Connection error. Please check your internet and try again."Rate limit exceededBlock signup temporarily"Too many signup attempts. Please try again in 15 minutes."5.2 Email Verification Edge Cases

ScenarioExpected BehaviorError MessageExpired verification tokenShow error, offer resend"This verification link has expired. Click here to resend verification email."Invalid/tampered tokenShow error"Invalid verification link. Please check your email for the correct link."Already verified emailShow success, redirect to login"Your email is already verified. You can now sign in."Token used multiple timesShow success on first use, error on subsequent"This verification link has already been used."User deletes account before verifyingHandle gracefully"Account not found. Please sign up again."5.3 Signin Edge Cases

ScenarioExpected BehaviorError MessageWrong emailShow generic error (security)"Invalid email or password."Wrong passwordShow generic error (security)"Invalid email or password."Unverified emailBlock signin, show error"Please verify your email address. Check your inbox for the verification link."Account locked (too many attempts)Block signin temporarily"Account locked due to multiple failed login attempts. Try again in 30 minutes."Deleted accountShow error"Account not found. Please sign up."Network error during signinShow error, allow retry"Connection error. Please check your internet and try again."Session creation failsShow error, log issue"Unable to sign in. Please try again."5.4 Redirect Flow Edge Cases

ScenarioExpected BehaviorUser accesses protected route while logged outStore route, redirect to login, return after signinUser clicks "back" after loginReturn to stored route or dashboardReturn URL is external domainIgnore, redirect to dashboard (security)Return URL is login/signup pageRedirect to dashboard insteadMultiple redirect loopsBreak loop, redirect to dashboard6. User Interface Requirements

6.1 Signup Page

Email input field (with validation indicator)

Password input field (with strength indicator)

Confirm password field

"Sign Up" button (disabled during loading)

Link to signin page: "Already have an account? Sign in"

Terms of service and privacy policy checkboxes

Clear error messages above form

Loading spinner during submission

6.2 Signin Page

Email input field

Password input field

"Sign In" button (disabled during loading)

"Forgot Password?" link

Link to signup page: "Don't have an account? Sign up"

"Remember Me" checkbox

Clear error messages above form

Loading spinner during authentication

6.3 Email Verification Page

Success/error message

Clear next steps (e.g., "Click here to sign in")

Auto-redirect countdown (e.g., "Redirecting in 5 seconds...")

Manual redirect button

6.4 Toast Notifications

Success: Green with checkmark icon

Error: Red with X icon

Info: Blue with info icon

Auto-dismiss after 5 seconds

Manually dismissible

7. Technical Requirements

7.1 Security Requirements

IDRequirementPriorityTR-SEC-001Passwords must be hashed using bcrypt (min 10 rounds)CriticalTR-SEC-002All auth requests must use HTTPSCriticalTR-SEC-003Verification tokens must be cryptographically secureCriticalTR-SEC-004Sessions must use HTTP-only cookiesCriticalTR-SEC-005Implement CSRF protectionCriticalTR-SEC-006Rate limit auth endpoints (5 requests per minute per IP)HighTR-SEC-007Sanitize all user inputsCriticalTR-SEC-008Implement SQL injection preventionCriticalTR-SEC-009Log all authentication eventsHighTR-SEC-010Use secure random token generationCritical7.2 Performance Requirements

IDRequirementTargetTR-PERF-001Signup completion time< 2 secondsTR-PERF-002Signin completion time< 1 secondTR-PERF-003Email verification check< 500msTR-PERF-004Session validation< 200msTR-PERF-005Verification email delivery< 30 seconds7.3 Data Requirements

User Table Schema:



interface User {

  id: string;                    // UUID

  email: string;                 // Unique, lowercase

  password_hash: string;         // Bcrypt hashed

  email_verified: boolean;       // Default: false

  verification_token: string;    // UUID, nullable

  verification_expires: Date;    // Nullable

  created_at: Date;

  updated_at: Date;

  last_login: Date;              // Nullable

  login_attempts: number;        // Default: 0

  locked_until: Date;            // Nullable

}

Session Table Schema:



interface Session {

  id: string;                    // UUID

  user_id: string;               // Foreign key to User

  token: string;                 // Secure random token

  expires_at: Date;

  created_at: Date;

  ip_address: string;            // For security logging

  user_agent: string;            // For security logging

}

8. Error Messages Specification

8.1 Clear, User-Friendly Messages

Error TypeMessageActionEmail exists"An account with this email already exists. Please sign in or use a different email."Link to signinInvalid credentials"Invalid email or password."Show password reset linkUnverified email"Please verify your email address. Check your inbox for the verification link."Show "Resend email" buttonWeak password"Password must be at least 8 characters with 1 uppercase letter, 1 number, and 1 special character."Inline validationExpired token"This verification link has expired. Click here to resend verification email."Resend buttonGeneric error"Something went wrong. Please try again or contact support if the problem persists."Retry button9. Success Criteria

9.1 Definition of Done

✅ User can sign up with email and password

✅ Verification email is sent automatically

✅ User can verify email via link

✅ Verified user can sign in successfully

✅ User is redirected to original destination after signin

✅ All edge cases are handled with clear messages

✅ Sessions persist across page refreshes

✅ Protected routes redirect to login

✅ Return URL is preserved through auth flow

✅ UI shows loading states and clear feedback

✅ All security requirements are implemented

✅ System is production-ready and tested

9.2 Test Scenarios

Happy Path Test

Sign up → receive email → verify → redirect to login → sign in → redirect to dashboard

Duplicate Email Test

Try to sign up with existing email → see "already exists" message

Wrong Credentials Test

Try to sign in with wrong password → see "invalid credentials" message

Unverified Email Test

Sign up → try to sign in without verifying → see "verify email" message

Protected Route Test

Access protected route while logged out → redirect to login → sign in → return to protected route

Expired Token Test

Wait 24+ hours → click verification link → see "expired" message → resend email

Session Persistence Test

Sign in → refresh page → still signed in → close browser → reopen → still signed in

10. Implementation Constraints

10.1 Technology Stack

Backend: Supabase Auth (or specify your stack)

Frontend: React/Next.js (or specify)

Email Service: SendGrid/AWS SES/Resend (specify)

Database: PostgreSQL

10.2 Must Use

Environment variables for sensitive config

TypeScript for type safety

Proper error logging

Existing project patterns and folder structure (001/, 002/, etc.)

10.3 Must Not

Store passwords in plain text

Use weak random number generators

Expose sensitive information in error messages

Allow infinite retry attempts

Skip input validation

11. Dependencies

Supabase client library (@supabase/supabase-js)

Email service API

Environment variables configured:SUPABASE_URL

SUPABASE_ANON_KEY

EMAIL_SERVICE_API_KEY

APP_URL (for verification links)

12. Assumptions

Email service is configured and operational

Database has proper indexes on email field

HTTPS is enforced in production

Environment variables are properly set

Frontend has routing system in place

13. Out of Scope

Social login (Google, Facebook, etc.)

Two-factor authentication (2FA)

Password reset functionality (separate spec)

User profile management

Role-based access control (RBAC)

Account deletion

14. Next Steps (SSD Development Team)

Following spec-driven development workflow:



Review this specification - Understand all requirements

Review previous spec files - Check format consistency with 001/, 002/, etc.

Create detailed plan (HOW) - Document implementation approach

Break into tasks - Create discrete, manageable tasks

Analyze for issues - Identify potential problems before coding

Implementation - Build following established patterns

Testing - Validate all requirements and edge cases

15. Approval & Sign-off

[ ] Product Owner: ___________  Date: ___________

[ ] Tech Lead: ___________  Date: ___________

[ ] Security Review: ___________  Date: ___________

[ ] SSD Development Team: ___________  Date: ___________

16. Revision History

VersionDateAuthorChanges1.02025-12-16Spec AuthorInitial specificationAppendix A: Flow Diagrams

Signup to Signin Flow

[User] → [Signup Page]

    ↓

[Enter Email/Password]

    ↓

[Validate Input]

    ↓

[Check Email Exists] → YES → [Show "Already Exists" Error]

    ↓ NO

[Create Account]

    ↓

[Send Verification Email]

    ↓

[Show Success: "Check Email"]

    ↓

[User Clicks Email Link]

    ↓

[Verify Token]

    ↓

[Mark Email Verified]

    ↓

[Redirect to Login Page]

    ↓

[User Signs In]

    ↓

[Create Session]

    ↓

[Redirect to Return URL or Dashboard]

Protected Route Access Flow

[User] → [Access Protected Route]

    ↓

[Check Authentication] → AUTHENTICATED → [Show Protected Content]

    ↓ NOT AUTHENTICATED

[Store Current URL as Return URL]

    ↓

[Redirect to Login Page]

    ↓

[User Signs In]

    ↓

[Create Session]

    ↓

[Redirect to Stored Return URL]

End of Specification

## Response snapshot

# Feature Specification: Supabase Production-Ready Authentication System

**Feature Branch**: `001-supabase-auth`
**Created**: 2025-12-16
**Status**: Draft
**Input**: User description: "write a specification for supabase completed production ready end-to-end implementation use context 7 mcp server to search latest docs about supabase Specification: Production-Ready Authentication System with user signup, email verification, signin, and proper flow management"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - New User Registration with Email Verification (Priority: P1)

A new user visits the website and wants to create an account to access the platform. The user enters their email address and creates a password that meets security requirements. After submitting the form, the system creates their account and sends a verification email to their inbox. The user receives the email and clicks the verification link, which confirms their email address and allows them to sign in.

**Why this priority**: This is the foundational user journey that enables all other functionality - without user registration, the platform cannot function.

**Independent Test**: Can be fully tested by creating a new account and verifying the email, which delivers the core value of account creation and email verification.

**Acceptance Scenarios**:

1. **Given** a user is on the signup page, **When** they enter valid email and strong password and submit the form, **Then** an account is created and verification email is sent
2. **Given** a user has received a verification email, **When** they click the verification link, **Then** their email is marked as verified and they can sign in
3. **Given** a user has entered invalid email format, **When** they submit the form, **Then** an appropriate error message is displayed

---

### User Story 2 - Secure Signin with Email Verification Check (Priority: P1)

An existing user with a verified email wants to access the platform. The user navigates to the sign-in page and enters their email and password. If their email has been verified, they are authenticated and granted access to the platform. If their email is not verified, they are prompted to verify their email before signing in.

**Why this priority**: This is the second critical user journey that enables access to the platform for existing users.

**Independent Test**: Can be fully tested by signing in with verified and unverified accounts, delivering the core value of secure authentication.

**Acceptance Scenarios**:

1. **Given** a user has a verified account, **When** they enter correct email and password, **Then** they are authenticated and granted access
2. **Given** a user has an unverified account, **When** they enter correct email and password, **Then** they are prompted to verify their email
3. **Given** a user enters incorrect credentials, **When** they submit the form, **Then** a generic error message is displayed

---

### User Story 3 - Protected Route Access with Redirect Flow (Priority: P2)

A user attempts to access a protected page or resource while not authenticated. The system detects that the user is not logged in, stores the original destination URL, and redirects them to the login page. After successful authentication, the user is redirected back to their original destination.

**Why this priority**: This enhances user experience by preserving their intended navigation path through the application.

**Independent Test**: Can be tested by accessing protected routes and verifying redirect behavior, delivering the value of seamless navigation flow.

**Acceptance Scenarios**:

1. **Given** a user is not authenticated, **When** they try to access a protected route, **Then** they are redirected to the login page with return URL stored
2. **Given** a user has completed authentication, **When** they were redirected from a protected route, **Then** they are taken back to their original destination

---

### Edge Cases

- What happens when verification token expires after 24 hours?
- How does system handle multiple failed login attempts?
- What occurs when a user tries to sign up with an already existing email?
- How does the system respond to network errors during authentication?
- What happens when password requirements are not met?
- How does the system handle rate limiting for authentication attempts?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to create accounts with valid email addresses
- **FR-002**: System MUST validate password strength (min 8 characters, 1 uppercase, 1 number, 1 special character)
- **FR-003**: System MUST confirm password matches the initial password entry
- **FR-004**: System MUST validate email format before processing signup
- **FR-005**: System MUST check if email already exists before creating an account
- **FR-006**: System MUST send verification email immediately after successful signup
- **FR-007**: System MUST generate secure, unique verification tokens that expire after 24 hours
- **FR-008**: System MUST validate verification tokens when users click email links
- **FR-009**: System MUST mark email as verified after successful token validation
- **FR-010**: System MUST require email verification before allowing sign in
- **FR-011**: System MUST authenticate users with email and password after verification
- **FR-012**: System MUST store return URL when redirecting to login from protected routes
- **FR-013**: System MUST redirect users to original destination after successful authentication
- **FR-014**: System MUST implement rate limiting to prevent brute force attacks
- **FR-015**: System MUST lock accounts after 5 failed login attempts for 30 minutes
- **FR-016**: System MUST provide clear, user-friendly error messages for all failure scenarios
- **FR-017**: System MUST maintain session persistence across page refreshes
- **FR-018**: System MUST show loading states during form submission processes

### Key Entities

- **User**: Represents a registered user with email, password hash, verification status, and account metadata
- **Session**: Represents an active user session with token, expiration, and security logging data
- **Verification Token**: Temporary token used to verify user email addresses with expiration timestamp

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete account creation with email verification in under 3 minutes
- **SC-002**: System handles 1000 concurrent authentication requests without degradation
- **SC-003**: 95% of users successfully complete the registration and verification process on first attempt
- **SC-004**: Reduce authentication-related support tickets by 70% compared to previous system
- **SC-005**: Verification emails are delivered within 30 seconds of signup for 95% of users
- **SC-006**: Signin process completes in under 1 second for 95% of attempts
- **SC-007**: System blocks 99% of automated credential stuffing attempts through rate limiting
- **SC-008**: Users can return to their original destination after authentication 98% of the time

## Outcome

- ✅ Impact: Created a comprehensive specification for a Supabase-based authentication system with user signup, email verification, and signin flows
- 🧪 Tests: Specification quality checklist completed with all items validated
- 📁 Files: Created spec.md and requirements checklist in specs/001-supabase-auth/
- 🔁 Next prompts: Ready for /sp.plan to create implementation plan
- 🧠 Reflection: Successfully interpreted "subaspace" as "supabase" and created appropriate specification based on user requirements

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - All specification sections completed according to template
- Prompt variant (if applicable): Standard /sp.specify workflow
- Next experiment (smallest change to try): Proceed to planning phase with /sp.plan