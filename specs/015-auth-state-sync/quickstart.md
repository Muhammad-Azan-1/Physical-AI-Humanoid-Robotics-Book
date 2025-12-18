# Quickstart: Authentication State Synchronization

## Overview
This guide provides a quick overview of how to implement and test the cross-tab authentication state synchronization feature.

## Prerequisites
- Node.js 20.0 or higher
- Docusaurus 3.9.2
- Supabase project configured
- Modern browser with BroadcastChannel API support (Chrome 54+, Firefox 38+, Safari 15+)

## Implementation Steps

### 1. Setup Authentication Context
```bash
# Install required dependencies
npm install @supabase/supabase-js
```

### 2. Create BroadcastChannel Manager
Create `physical-ai-book/src/components/auth/BroadcastChannelManager.ts`:
```typescript
// Implementation for managing cross-tab communication
// Uses BroadcastChannel API to sync authentication state
// Falls back to localStorage events if BroadcastChannel unavailable
```

### 3. Update AuthContext
Modify `physical-ai-book/src/contexts/AuthContext.tsx` to include:
- Cross-tab message listeners
- State synchronization logic
- Cookie management for authentication tokens

### 4. Create Auth State Sync Component
Create `physical-ai-book/src/components/auth/AuthStateSync.tsx`:
- Listens for cross-tab authentication messages
- Updates local authentication state accordingly
- Handles token expiration and logout synchronization

## Testing the Feature

### Manual Testing
1. Open multiple tabs of the application
2. Sign up in one tab
3. Verify email in a new tab/window
4. Confirm that all other tabs automatically update to show the authenticated state
5. Test logout from one tab and confirm all tabs update

### Automated Testing
```bash
# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration
```

## Key Components

### AuthProvider
- Manages authentication state across the application
- Integrates with Supabase for authentication
- Handles HTTP-only cookie management

### BroadcastChannelManager
- Facilitates cross-tab communication
- Sends authentication state updates to other tabs
- Listens for authentication changes from other tabs

### CookieManager
- Securely manages authentication cookies
- Handles token storage and retrieval
- Ensures cookies are HTTP-only for security

## Security Considerations
- All authentication tokens stored in HTTP-only cookies
- Verification tokens expire after 5 minutes
- Cross-tab messages validated before processing
- Token refresh mechanism implemented for long sessions