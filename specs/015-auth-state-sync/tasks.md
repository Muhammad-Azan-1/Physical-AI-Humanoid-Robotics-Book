# Implementation Tasks: Authentication State Synchronization

**Feature**: 015-auth-state-sync | **Date**: 2025-12-18 | **Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md) | **Input**: Feature specification and implementation plan

## Implementation Strategy

Implement cross-tab authentication state synchronization using BroadcastChannel API and HTTP-only cookies to ensure consistent authentication state across all open browser tabs after email verification. The solution will automatically authenticate users after verification and maintain synchronized state across all tabs without requiring page refresh.

The implementation follows an MVP-first approach, starting with core authentication state synchronization (User Story 1), then adding post-verification flow (User Story 2), and finally cross-tab logout synchronization (User Story 3).

## Dependencies

User stories can be implemented independently but share foundational components:
- User Story 2 depends on User Story 1's authentication infrastructure
- User Story 3 shares the cross-tab communication infrastructure with User Story 1

## Parallel Execution Examples

- **User Story 1**: Can parallelize BroadcastChannelManager implementation [T015] with AuthStateSync component [T016]
- **User Story 2**: Can parallelize callback page updates [T025] with redirect logic [T026]
- **User Story 3**: Can parallelize logout handling [T035] with token expiration handling [T036]

---

## Phase 1: Setup

Setup foundational authentication infrastructure and dependencies.

- [ ] T001 Install and configure Supabase dependencies in physical-ai-book package.json
- [ ] T002 Set up authentication API endpoints for email verification and token refresh
- [ ] T003 Configure HTTP-only cookie settings for secure token storage
- [ ] T004 Create base authentication utilities file in physical-ai-book/src/utils/authHelpers.ts

## Phase 2: Foundational Components

Implement core authentication infrastructure required by all user stories.

- [ ] T005 Create AuthContext in physical-ai-book/src/contexts/AuthContext.tsx with state management
- [ ] T006 Implement useAuth hook in physical-ai-book/src/hooks/useAuth.ts
- [ ] T007 Create CookieManager utility in physical-ai-book/src/components/auth/CookieManager.ts
- [ ] T008 Create BroadcastChannelManager in physical-ai-book/src/components/auth/BroadcastChannelManager.ts
- [ ] T009 Update existing AuthProvider to support new state synchronization
- [ ] T010 Create CrossTabMessage type definition based on data model
- [ ] T011 Implement authentication state validation based on data model requirements
- [ ] T012 Set up token expiration handling mechanism
- [ ] T013 Create authentication state type based on data model
- [ ] T014 Implement verification token validation logic (5-minute expiration)

## Phase 3: [US1] Consistent Authentication State After Email Verification

Implement synchronization of authentication state across all open browser tabs when email verification occurs.

**Goal**: When a user verifies their email in one tab, all other open tabs automatically update to show the authenticated state without requiring manual refresh.

**Independent Test**: Open multiple tabs of the application, sign up in one tab, verify email in a new tab, and confirm that all original tabs update to reflect the authenticated state without requiring manual refresh.

- [ ] T015 [P] [US1] Implement BroadcastChannelManager with AUTH_UPDATE message handling
- [ ] T016 [P] [US1] Create AuthStateSync component to listen for cross-tab authentication changes
- [ ] T017 [US1] Update AuthContext to handle incoming cross-tab authentication messages
- [ ] T018 [US1] Implement authentication state synchronization logic when receiving AUTH_UPDATE messages
- [ ] T019 [US1] Add UI update mechanism to reflect synchronized authentication state
- [ ] T020 [US1] Implement detection of email verification in another tab
- [ ] T021 [US1] Create fallback mechanism using localStorage events if BroadcastChannel unavailable
- [ ] T022 [US1] Add cross-tab message validation based on data model requirements
- [ ] T023 [US1] Implement sourceTabId generation for cross-tab message tracking
- [ ] T024 [US1] Test authentication state synchronization across multiple tabs

## Phase 4: [US2] Seamless Post-Verification Authentication Flow

Implement automatic authentication after email verification without requiring additional login steps.

**Goal**: After email verification, users should be automatically signed in without needing to navigate back to the sign-in page or perform additional authentication steps.

**Independent Test**: Complete the sign-up process, follow the verification link, and confirm that the user is automatically authenticated without additional login steps.

- [ ] T025 [P] [US2] Update callback page in physical-ai-book/src/pages/auth/callback.tsx to handle verification tokens
- [ ] T026 [US2] Implement redirect logic to stored original_destination or default to home page
- [ ] T027 [US2] Create token validation function that checks 5-minute expiration window
- [ ] T028 [US2] Implement automatic authentication after successful token verification
- [ ] T029 [US2] Update signup page to store original destination before verification
- [ ] T030 [US2] Add token refresh mechanism after successful verification
- [ ] T031 [US2] Update UI to reflect authenticated state immediately after verification
- [ ] T032 [US2] Handle expired verification token scenario gracefully
- [ ] T033 [US2] Implement verification token usage tracking to prevent reuse
- [ ] T034 [US2] Test seamless authentication flow from verification to authenticated state

## Phase 5: [US3] Cross-Tab Authentication State Persistence

Implement synchronization of logout and token expiration across all open browser tabs.

**Goal**: When a user logs out from one tab, all other open tabs should reflect the logged-out state. Similarly, when authentication expires or is revoked in one context, all contexts should update consistently.

**Independent Test**: Log out from one tab and confirm that all other open tabs update to reflect the logged-out state without manual refresh.

- [ ] T035 [P] [US3] Implement logout handling in BroadcastChannelManager for LOGOUT messages
- [ ] T036 [P] [US3] Implement token expiration handling in BroadcastChannelManager for TOKEN_EXPIRED messages
- [ ] T037 [US3] Update AuthContext to broadcast logout events to other tabs
- [ ] T038 [US3] Update AuthContext to broadcast token expiration events to other tabs
- [ ] T039 [US3] Implement cross-tab logout synchronization in AuthStateSync component
- [ ] T040 [US3] Implement cross-tab token expiration synchronization in AuthStateSync component
- [ ] T041 [US3] Update UI to reflect logout state across all tabs
- [ ] T042 [US3] Update UI to handle token expiration across all tabs
- [ ] T043 [US3] Implement proper cleanup of authentication state on logout/token expiration
- [ ] T044 [US3] Test logout and token expiration synchronization across multiple tabs

## Phase 6: Polish & Cross-Cutting Concerns

Final implementation details, edge cases, and quality improvements.

- [ ] T045 Implement fallback mechanism for cross-tab communication failures (manual refresh notification)
- [ ] T046 Add comprehensive error handling for all authentication flows
- [ ] T047 Create authentication setup documentation in physical-ai-book/docs/authentication-setup.md
- [ ] T048 Add loading states for authentication transitions
- [ ] T049 Handle offline scenarios when tabs lose connectivity
- [ ] T050 Add analytics tracking for authentication state changes
- [ ] T051 Update navigation components to reflect authentication state changes
- [ ] T052 Implement proper cleanup of event listeners and broadcast channels
- [ ] T053 Add tests for cross-tab synchronization functionality
- [ ] T054 Performance optimization for cross-tab message handling
- [ ] T055 Final end-to-end testing of all user stories
- [ ] T056 Update README with authentication state sync feature documentation