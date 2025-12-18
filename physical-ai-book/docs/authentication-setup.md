# Authentication Setup Guide

This document explains how to set up and configure the authentication system for the Physical AI & Humanoid Robotics educational platform.

## Overview

The authentication system provides secure user registration, login, and email verification functionality. It includes cross-tab synchronization to ensure consistent authentication state across all open browser tabs.

## Features

### Cross-Tab Authentication Synchronization
- Authentication state is synchronized across all open browser tabs using BroadcastChannel API
- Fallback to localStorage events for broader browser compatibility
- When a user logs in, logs out, or verifies their email in one tab, all other tabs automatically update

### Email Verification
- Users must verify their email address after registration
- Verification tokens expire after 5 minutes for security
- Automatic authentication after successful verification

### Secure Token Management
- HTTP-only cookies for secure token storage
- Automatic token refresh
- Session validation and cleanup

## Configuration

### Environment Variables

Set these environment variables in your `.env` file:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### Docusaurus Configuration

In `docusaurus.config.js`, add the Supabase configuration to `customFields`:

```js
module.exports = {
  // ... other config
  customFields: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    // ... other custom fields
  },
};
```

## Implementation Details

### Components

- `AuthContext`: Manages authentication state across the application
- `BroadcastChannelManager`: Handles cross-tab communication
- `AuthStateSync`: Synchronizes authentication state across tabs
- `CookieManager`: Manages authentication-related cookies

### Key Files

- `src/contexts/AuthContext.tsx`: Main authentication state management
- `src/components/auth/BroadcastChannelManager.ts`: Cross-tab communication
- `src/components/auth/AuthStateSync.tsx`: Authentication state synchronization
- `src/components/auth/CookieManager.ts`: Cookie management utilities
- `src/pages/auth/callback.tsx`: Handles authentication callbacks and email verification
- `src/pages/signup.tsx`: User registration flow

## Security Considerations

- All authentication tokens are stored securely using HTTP-only cookies where possible
- Verification tokens have a 5-minute expiration window
- Cross-tab communication is validated to prevent unauthorized state changes
- Input sanitization is performed on all user-provided data
- Session validation is performed on each request

## Troubleshooting

### Cross-Tab Synchronization Not Working

1. Check if the browser supports BroadcastChannel API
2. Verify that all tabs are on the same origin
3. Check browser console for errors related to cross-tab communication

### Email Verification Issues

1. Verify that the verification link is not expired (5-minute window)
2. Check that the Supabase configuration is correct
3. Ensure the email verification settings are properly configured in Supabase dashboard

### Session Issues

1. Clear browser cookies and cache if experiencing session problems
2. Verify that the session timeout settings are configured correctly
3. Check that the token refresh mechanism is working properly