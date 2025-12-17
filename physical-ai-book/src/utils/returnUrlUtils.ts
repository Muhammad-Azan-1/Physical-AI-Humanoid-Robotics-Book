/**
 * Utility functions for handling return URLs in authentication flows
 */

/**
 * Captures the current page URL to be used as a return URL after authentication
 */
export const captureReturnUrl = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.pathname + window.location.search;
  }
  return '/';
};

/**
 * Constructs an authentication URL with the return URL as a query parameter
 */
export const constructAuthUrlWithReturn = (authPath: string, returnUrl?: string): string => {
  const finalReturnUrl = returnUrl || captureReturnUrl();

  // Don't include auth pages as return URLs to prevent loops
  if (finalReturnUrl.includes('/signin') || finalReturnUrl.includes('/signup') || finalReturnUrl.includes('/auth')) {
    return authPath;
  }

  const encodedReturnUrl = encodeURIComponent(finalReturnUrl);
  const separator = authPath.includes('?') ? '&' : '?';
  return `${authPath}${separator}returnUrl=${encodedReturnUrl}`;
};

/**
 * Gets the return URL from query parameters
 */
export const getReturnUrlFromParams = (): string | null => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const returnUrl = urlParams.get('returnUrl');
    return returnUrl ? decodeURIComponent(returnUrl) : null;
  }
  return null;
};

/**
 * Checks if the current page is an authentication page
 */
export const isAuthPage = (): boolean => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    return path.includes('/signin') || path.includes('/signup') || path.includes('/auth');
  }
  return false;
};