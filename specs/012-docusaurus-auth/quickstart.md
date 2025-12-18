# Quickstart: Docusaurus Authentication System

## Prerequisites
- Node.js (LTS version >= 18.0.0)
- npm or yarn package manager
- Supabase account (for authentication and database services)
- Basic knowledge of React and TypeScript

## Setup Supabase Project
1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Note your Project URL and Anonymous/Public API Key
4. In the Supabase dashboard, go to Authentication → Settings
5. Add your site URLs to "Redirect URLs" (e.g., http://localhost:3000 for development)

## Installation
1. Install the Supabase client library:
```bash
npm install @supabase/supabase-js
```

2. Create environment variables for Supabase configuration:
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Initialize Supabase Client
Create a Supabase client instance in `src/services/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## Set Up Authentication Context
1. Create the authentication context in `src/contexts/AuthContext.tsx`:
```typescript
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../services/supabase'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user || null)
      setLoading(false)

      // Listen for auth changes
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session)
          setUser(session?.user || null)
          setLoading(false)
        }
      )

      return () => {
        subscription.unsubscribe()
      }
    }

    checkSession()
  }, [])

  const signUp = async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password })
  }

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  const resetPassword = async (email: string) => {
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`
    })
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

## Wrap Your Application
In your main application file, wrap your app with the AuthProvider:

```typescript
// In your main Docusaurus app
import { AuthProvider } from './contexts/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      {/* Your Docusaurus content */}
    </AuthProvider>
  )
}
```

## Create Protected Route Component
Create `src/components/auth/ProtectedRoute.tsx`:
```typescript
import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../common/LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
  fallback?: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = 'student',
  fallback = <div>Please log in to access this content.</div>
}) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return fallback
  }

  // Add role checking logic if needed
  // For now, just checking if user is authenticated

  return <>{children}</>
}

export default ProtectedRoute
```

## Create Authentication Components
1. Create a login form component
2. Create a signup form component
3. Create a user profile component

## Update Docusaurus Configuration
Add authentication-related pages to your Docusaurus configuration if needed:
```typescript
// In docusaurus.config.ts
export default config: Config = {
  // ... other config
  plugins: [
    // ... other plugins
    // Add any auth-related plugins here
  ],
}
```

## Environment Variables for Production
For production deployment, ensure these environment variables are set:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

## Testing the Setup
1. Run your Docusaurus application: `npm run start`
2. Navigate to your authentication pages
3. Test sign up, sign in, and sign out functionality
4. Verify that protected routes work correctly