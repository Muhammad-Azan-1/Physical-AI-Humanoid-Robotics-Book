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