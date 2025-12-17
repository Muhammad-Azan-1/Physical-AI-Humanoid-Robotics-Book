import { AuthError } from '@supabase/supabase-js';

/**
 * Validates email format using a standard regex pattern
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 number
 * - At least 1 special character
 */
export const validatePassword = (password: string): boolean => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return minLength && hasUpperCase && hasNumber && hasSpecialChar;
};

/**
 * Validates that two passwords match
 */
export const passwordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

/**
 * Handles authentication errors and returns user-friendly messages
 */
export const handleAuthError = (error: AuthError | Error): string => {
  if (error instanceof Error) {
    // Handle different error types based on their message
    const message = error.message.toLowerCase();

    if (message.includes('email')) {
      if (message.includes('invalid')) {
        return 'Please enter a valid email address.';
      }
      if (message.includes('exists') || message.includes('registered')) {
        return 'An account with this email already exists. Please sign in or use a different email.';
      }
    }

    if (message.includes('password')) {
      if (message.includes('weak') || message.includes('strength')) {
        return 'Password must be at least 8 characters with 1 uppercase letter, 1 number, and 1 special character.';
      }
      return 'Invalid email or password.';
    }

    if (message.includes('verify') || message.includes('unverified')) {
      return 'Please verify your email address. Check your inbox for the verification link.';
    }

    if (message.includes('expired') || message.includes('invalid') || message.includes('token')) {
      return 'Invalid or expired verification token. Please request a new verification email.';
    }
  }

  // Default error message
  return 'An error occurred. Please try again or contact support if the problem persists.';
};

/**
 * Checks if a user is authenticated based on their verification status
 */
export const isUserAuthenticated = (user: any | null, emailVerified: boolean = true): boolean => {
  return user !== null && user.id !== undefined && emailVerified;
};

/**
 * Sanitizes user input to prevent XSS and other injection attacks
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
};

/**
 * Checks if a session is still valid based on expiration time
 */
export const isSessionValid = (session: any): boolean => {
  if (!session || !session.expires_at) {
    return false;
  }

  // Check if session expires within the next minute (to account for potential clock differences)
  const now = Math.floor(Date.now() / 1000);
  const buffer = 60; // 1 minute buffer

  return session.expires_at - now > buffer;
};

/**
 * Validates if a redirect URL is safe and internal to the application
 */
export const isValidRedirectUrl = (url: string): boolean => {
  try {
    // Only allow internal URLs starting with `/`
    if (!url || !url.startsWith('/')) return false;

    // Prevent open redirect vulnerabilities (no protocol or domain)
    if (url.includes('://') || url.startsWith('//')) return false;

    // Prevent redirect loops to auth pages (signin/signup)
    if (url.includes('/signin') || url.includes('/signout') || url.includes('/signup') || url.includes('/auth')) return false;

    return true;
  } catch {
    return false;
  }
};

/**
 * Validates redirect URL and returns a safe fallback if invalid
 */
export const getValidRedirectUrl = (url: string | null | undefined, fallback = '/'): string => {
  if (url && isValidRedirectUrl(url)) {
    return url;
  }
  return fallback;
};

/**
 * Formats error messages based on Supabase error codes
 */
export const formatAuthErrorMessage = (error: AuthError | null): string => {
  if (!error) return '';

  switch (error.status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Invalid email or password.';
    case 403:
      return 'Access denied. Please verify your email address.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Server error. Please try again later.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
};