/**
 * CookieManager - Utility for managing HTTP-only cookies for authentication
 *
 * Note: Since HTTP-only cookies cannot be accessed via JavaScript, this manager
 * focuses on client-side operations that complement server-side cookie management.
 * For actual HTTP-only cookie management, server-side implementation is required.
 */

interface CookieOptions {
  expires?: Date | number | string;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Sets a cookie with the specified name, value, and options
 */
export const setCookie = (name: string, value: string, options: CookieOptions = {}): void => {
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  // Handle expiration
  if (options.expires) {
    if (typeof options.expires === 'number') {
      const date = new Date();
      date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
      cookieString += `; expires=${date.toUTCString()}`;
    } else if (options.expires instanceof Date) {
      cookieString += `; expires=${options.expires.toUTCString()}`;
    } else {
      cookieString += `; expires=${options.expires}`;
    }
  }

  // Add other options
  if (options.path) cookieString += `; path=${options.path}`;
  if (options.domain) cookieString += `; domain=${options.domain}`;
  if (options.secure) cookieString += '; secure';
  if (options.sameSite) cookieString += `; samesite=${options.sameSite}`;

  document.cookie = cookieString;
};

/**
 * Gets a cookie value by name
 */
export const getCookie = (name: string): string | null => {
  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }

    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }

  return null;
};

/**
 * Removes a cookie by setting its expiration to the past
 */
export const removeCookie = (name: string, path?: string, domain?: string): void => {
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT${path ? `; path=${path}` : ''}${domain ? `; domain=${domain}` : ''}`;
};

/**
 * Checks if a cookie exists
 */
export const hasCookie = (name: string): boolean => {
  return getCookie(name) !== null;
};

/**
 * Sets authentication tokens in cookies (client-side only)
 * Note: For HTTP-only cookies, this would be handled server-side
 */
export const setAuthCookies = (accessToken: string, refreshToken: string, options?: CookieOptions): void => {
  const cookieOptions = {
    ...options,
    path: '/',
    secure: true,
    sameSite: 'strict' as const,
    expires: options?.expires || 7 // Default to 7 days for access token
  };

  // Set access token with shorter expiration
  setCookie('auth_access_token', accessToken, {
    ...cookieOptions,
    expires: options?.expires || 1 // Default to 1 day for access token
  });

  // Set refresh token with longer expiration
  setCookie('auth_refresh_token', refreshToken, {
    ...cookieOptions,
    expires: options?.expires || 30 // Default to 30 days for refresh token
  });
};

/**
 * Gets authentication tokens from cookies
 * Note: This only works for non-HTTP-only cookies
 */
export const getAuthTokens = (): { accessToken: string | null; refreshToken: string | null } => {
  return {
    accessToken: getCookie('auth_access_token'),
    refreshToken: getCookie('auth_refresh_token')
  };
};

/**
 * Removes authentication tokens from cookies
 */
export const clearAuthCookies = (): void => {
  removeCookie('auth_access_token');
  removeCookie('auth_refresh_token');
};

/**
 * Sets verification token in cookie
 */
export const setVerificationToken = (token: string, options?: CookieOptions): void => {
  const cookieOptions = {
    ...options,
    path: '/',
    secure: true,
    sameSite: 'strict' as const,
    expires: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes expiration
  };

  setCookie('verification_token', token, cookieOptions);
};

/**
 * Gets verification token from cookie
 */
export const getVerificationToken = (): string | null => {
  return getCookie('verification_token');
};

/**
 * Removes verification token from cookie
 */
export const clearVerificationToken = (): void => {
  removeCookie('verification_token');
};