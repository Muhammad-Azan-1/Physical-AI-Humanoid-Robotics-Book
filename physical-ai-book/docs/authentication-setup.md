# Authentication Setup Guide

This document provides instructions for setting up and using the authentication system in the Physical AI & Humanoid Robotics book.

## Overview

The authentication system is built using Supabase for backend services and React Context for state management. It provides user registration, login, profile management, and content protection features.

## Prerequisites

- A Supabase account
- Environment variables configured for your Supabase project

## Configuration

### Environment Variables

Create a `.env` file in the root of your project with the following variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

> Note: The `SUPABASE_SERVICE_ROLE_KEY` is only needed for server-side operations and should be kept secure.

### Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and API keys from Project Settings → API
3. Enable email authentication in Authentication → Settings
4. Add your site URLs to redirect URLs for development and production

## Components

### AuthContext and useAuth

The `AuthContext` provides global authentication state management. Use the `useAuth` hook to access authentication functions throughout your application:

```tsx
import { useAuth } from '/src/hooks/useAuth';

const MyComponent = () => {
  const { user, loading, isAuthenticated, signIn, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.email}!</p>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <div>Please sign in</div>
      )}
    </div>
  );
};
```

### ProtectedRoute

Use `ProtectedRoute` to restrict access to certain components:

```tsx
import ProtectedRoute from '/src/components/auth/ProtectedRoute';

const PremiumContent = () => (
  <ProtectedRoute requiredRole="premium">
    <div>Premium content here</div>
  </ProtectedRoute>
);
```

## Pages

### Sign Up (`/signup`)

Allows new users to create an account with email and password.

### Sign In (`/signin`)

Allows existing users to log in with their credentials.

### Profile (`/profile`)

Allows authenticated users to view and update their profile information.

### Reset Password (`/reset-password`)

Handles password reset functionality.

## Security Features

- Password strength requirements
- Secure session management
- Role-based access control
- Input validation
- Protection against common vulnerabilities

## Testing

Unit tests for authentication components can be found in the `src/components/auth/__tests__` directory.

## Troubleshooting

### Common Issues

- **Session not persisting**: Ensure your Supabase project URL and keys are correct
- **Redirects not working**: Check that your redirect URLs are properly configured in Supabase
- **Email verification not working**: Verify that email templates are set up in Supabase

### Error Messages

- "Invalid credentials": Check email and password for correctness
- "Password does not meet requirements": Ensure password meets complexity requirements
- "Email already in use": Use a different email or reset existing account password

## Development

When developing locally, ensure you have the proper environment variables set and that your Supabase project allows `localhost` as a redirect URL.