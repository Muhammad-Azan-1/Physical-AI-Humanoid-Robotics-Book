import { AuthError, Session } from '@supabase/supabase-js'
import { AuthState, User } from '../types/auth'

/**
 * Checks if the current session is valid and not expired
 */
export const isSessionValid = (session: Session | null): boolean => {
  if (!session) return false
  const currentTime = new Date().getTime()
  const expiresAt = new Date(session.expires_at).getTime()
  return currentTime < expiresAt
}

/**
 * Handles authentication errors and returns a user-friendly message
 */
export const handleAuthError = (error: AuthError | Error | null): string => {
  if (!error) return ''

  // Supabase AuthError
  if ('status' in error) {
    switch (error.status) {
      case 429:
        return 'Too many requests. Please try again later.'
      case 400:
        return 'Invalid request. Please check your input.'
      case 401:
        return 'Invalid credentials. Please try again.'
      case 403:
        return 'Access denied. Please contact support.'
      default:
        return error.message || 'An authentication error occurred.'
    }
  }

  // General Error
  return error.message || 'An unexpected error occurred.'
}

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates password strength
 */
export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

/**
 * Checks if user is authenticated based on session
 */
export const isAuthenticated = (authState: AuthState): boolean => {
  return authState.isAuthenticated && !!authState.user
}

/**
 * Gets the current user's role
 */
export const getUserRole = (user: User | null): string => {
  return user?.role || 'anonymous'
}

/**
 * Checks if user has a specific role
 */
export const hasRole = (user: User | null, role: string): boolean => {
  return user?.role === role
}

/**
 * Checks if user has admin role
 */
export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, 'admin')
}

/**
 * Checks if user has premium access
 */
export const hasPremiumAccess = (user: User | null): boolean => {
  return ['premium', 'admin'].includes(user?.role || '')
}

/**
 * Formats user display name
 */
export const formatDisplayName = (user: User | null): string => {
  if (!user) return 'Guest'
  if (user.profile?.display_name) return user.profile.display_name
  if (user.profile?.first_name && user.profile?.last_name) {
    return `${user.profile.first_name} ${user.profile.last_name}`
  }
  if (user.profile?.first_name) return user.profile.first_name
  if (user.email) return user.email.split('@')[0]
  return 'User'
}