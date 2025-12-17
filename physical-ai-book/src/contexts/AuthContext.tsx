import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react'
import { Session, User as SupabaseUser, AuthError, SupabaseClient } from '@supabase/supabase-js'
import { initializeSupabase, getSupabase } from '../services/supabase'
import { AuthContextType, AuthState, User, UserProfile, SignUpOptions } from '../types/auth'
import { handleAuthError, isSessionValid } from '../utils/auth-utils'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

interface AuthProviderProps {
  children: ReactNode
}

// Helper function to convert Supabase User to our custom User type
const supabaseUserToCustomUser = (supabaseUser: SupabaseUser | null): User | null => {
  if (!supabaseUser) return null;

  // Create a default profile if it doesn't exist
  const defaultProfile: UserProfile = {
    user_id: supabaseUser.id,
    username: supabaseUser.user_metadata?.username,
    first_name: supabaseUser.user_metadata?.first_name,
    last_name: supabaseUser.user_metadata?.last_name,
    display_name: supabaseUser.user_metadata?.display_name,
    avatar_url: supabaseUser.user_metadata?.avatar_url || undefined,
    bio: undefined,
    preferences: {
      theme: 'light',
      notifications: {
        email: true,
        push: true
      }
    },
    learning_progress: {
      completed_courses: [],
      achievements: [],
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    email_verified: supabaseUser.email_confirmed_at ? true : false,
    created_at: supabaseUser.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
    role: supabaseUser.role || 'user',
    profile: defaultProfile
  };
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { siteConfig } = useDocusaurusContext()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [emailVerificationState, setEmailVerificationState] = useState<{
    isVerifying: boolean;
    verificationComplete: boolean;
    showSuccessMessage: boolean;
    redirectAfterVerification: boolean;
  }>({
    isVerifying: false,
    verificationComplete: false,
    showSuccessMessage: false,
    redirectAfterVerification: false
  })

  // Initialize Supabase client
  useEffect(() => {
    const initSupabase = async () => {
      try {
        const supabaseUrl = siteConfig.customFields?.supabaseUrl as string;
        const supabaseAnonKey = siteConfig.customFields?.supabaseAnonKey as string;
        const client = initializeSupabase({ url: supabaseUrl, anonKey: supabaseAnonKey });
        setSupabase(client);

        // Check active session
        const { data: { session } } = await client.auth.getSession();
        if (session) {
          setSession(session);
          const customUser = supabaseUserToCustomUser(session.user);
          setUser(customUser);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setSession(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error initializing Supabase:', error);
        handleAuthError(error as AuthError, siteConfig.baseUrl);
      } finally {
        setLoading(false);
      }
    };

    initSupabase();
  }, [siteConfig.baseUrl]);

  // Set up auth state change listener
  useEffect(() => {
    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);

      if (session) {
        const customUser = supabaseUserToCustomUser(session.user);
        setUser(customUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }

      // Store auth state in localStorage for cross-window synchronization
      const authState = {
        event,
        session,
        timestamp: Date.now(),
      };
      localStorage.setItem('auth-state', JSON.stringify(authState));
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase]);

  // Cross-window auth state synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth-state' && e.newValue) {
        try {
          const authState = JSON.parse(e.newValue);
          if (authState.session) {
            setSession(authState.session);
            const customUser = supabaseUserToCustomUser(authState.session.user);
            setUser(customUser);
            setIsAuthenticated(true);
          } else {
            setUser(null);
            setSession(null);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Error parsing auth state from storage:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sign up function
  const signUp = useCallback(async (email: string, password: string, options: SignUpOptions = {}) => {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}${siteConfig.baseUrl}auth/callback`,
        data: {
          username: options.username,
          first_name: options.firstName,
          last_name: options.lastName,
          display_name: options.displayName,
        }
      }
    })

    if (error) {
      console.error('Signup error:', error.message, error.status)
      throw error
    }

    // Update local state if user was created
    if (data.user) {
      const customUser = supabaseUserToCustomUser(data.user);
      setUser(customUser);
      // Don't set session here as email verification is required
    }

    return data
  }, [supabase, siteConfig.baseUrl])

  // Sign in function
  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('Signin error:', error.message, error.status)
      throw error
    }

    if (data.session) {
      setSession(data.session);
      const customUser = supabaseUserToCustomUser(data.session.user);
      setUser(customUser);
      setIsAuthenticated(true);
    }

    return data
  }, [supabase])

  // Sign out function
  const signOut = useCallback(async () => {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Signout error:', error.message, error.status)
      throw error
    }

    setUser(null)
    setSession(null)
    setIsAuthenticated(false)

    // Clear auth state in localStorage
    localStorage.removeItem('auth-state');
  }, [supabase])

  // Reset password function
  const resetPassword = useCallback(async (email: string) => {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${siteConfig.baseUrl}auth/callback`
    })

    if (error) {
      console.error('Password reset error:', error.message, error.status)
      throw error
    }

    return;
  }, [supabase, siteConfig.baseUrl])

  // Update profile function
  const updateProfile = useCallback(async (profileData: Partial<UserProfile>) => {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Update user metadata
    const { data, error } = await supabase.auth.updateUser({
      data: profileData
    });

    if (error) {
      console.error('Profile update error:', error.message, error.status);
      throw error;
    }

    if (data.user) {
      const updatedUser = supabaseUserToCustomUser(data.user);
      setUser(updatedUser);
      return updatedUser || undefined;
    }

    return undefined;
  }, [supabase])

  // Email verification methods
  const verifyEmail = useCallback(async (token: string) => {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    try {
      setEmailVerificationState(prev => ({ ...prev, isVerifying: true }));

      const { data, error } = await supabase.auth.verifyOtp({
        type: 'email',
        token: token,
        email: user?.email || '', // Email is required when using type 'email'
      });

      if (error) {
        console.error('Email verification error:', error.message, error.status);
        throw error;
      }

      if (data.session) {
        // Update session and user after successful verification
        setSession(data.session);
        const customUser = supabaseUserToCustomUser(data.session.user);
        setUser(customUser);
        setIsAuthenticated(true);

        // Update verification state
        setEmailVerificationState(prev => ({
          ...prev,
          verificationComplete: true,
          showSuccessMessage: true,
          isVerifying: false
        }));

        // Hide success message after 3 seconds
        setTimeout(() => {
          setEmailVerificationState(prev => ({ ...prev, showSuccessMessage: false }));
        }, 3000);

        return data;
      } else {
        // If no session returned, the token might be for email confirmation only
        setEmailVerificationState(prev => ({
          ...prev,
          verificationComplete: true,
          showSuccessMessage: true,
          isVerifying: false
        }));

        // Refresh user data
        const { data: { user: refreshedUser } } = await supabase.auth.getUser();
        if (refreshedUser) {
          const customUser = supabaseUserToCustomUser(refreshedUser);
          setUser(customUser);
        }

        // Hide success message after 3 seconds
        setTimeout(() => {
          setEmailVerificationState(prev => ({ ...prev, showSuccessMessage: false }));
        }, 3000);

        return { user: refreshedUser, session: null };
      }
    } catch (error) {
      setEmailVerificationState(prev => ({ ...prev, isVerifying: false }));
      console.error('Email verification error:', error);
      throw error;
    }
  }, [supabase, user?.email]);

  const resendVerificationEmail = useCallback(async (email: string) => {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}${siteConfig.baseUrl}auth/callback`
        }
      });

      if (error) {
        console.error('Resend verification email error:', error.message, error.status);
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Resend verification email error:', error);
      throw error;
    }
  }, [supabase, siteConfig.baseUrl]);

  const value: AuthContextType = {
    user,
    session,
    loading,
    isAuthenticated,
    emailVerificationState,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    verifyEmail,
    resendVerificationEmail
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