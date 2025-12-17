import { isValidRedirectUrl, getValidRedirectUrl } from '../authHelpers';

describe('URL Validation Utilities', () => {
  describe('isValidRedirectUrl', () => {
    test('should return true for valid internal URLs', () => {
      expect(isValidRedirectUrl('/')).toBe(true);
      expect(isValidRedirectUrl('/dashboard')).toBe(true);
      expect(isValidRedirectUrl('/docs/guide')).toBe(true);
      expect(isValidRedirectUrl('/profile?tab=settings')).toBe(true);
    });

    test('should return false for external URLs', () => {
      expect(isValidRedirectUrl('https://example.com')).toBe(false);
      expect(isValidRedirectUrl('http://example.com')).toBe(false);
      expect(isValidRedirectUrl('//example.com')).toBe(false);
      expect(isValidRedirectUrl('javascript:alert(1)')).toBe(false);
    });

    test('should return false for auth page redirects to prevent loops', () => {
      expect(isValidRedirectUrl('/signin')).toBe(false);
      expect(isValidRedirectUrl('/signup')).toBe(false);
      expect(isValidRedirectUrl('/auth/callback')).toBe(false);
      expect(isValidRedirectUrl('/signout')).toBe(false);
    });

    test('should return false for null, undefined, or empty URLs', () => {
      expect(isValidRedirectUrl('')).toBe(false);
      expect(isValidRedirectUrl(null as any)).toBe(false);
      expect(isValidRedirectUrl(undefined as any)).toBe(false);
    });

    test('should return false for URLs not starting with /', () => {
      expect(isValidRedirectUrl('dashboard')).toBe(false);
      expect(isValidRedirectUrl(' docs/guide')).toBe(false);
    });
  });

  describe('getValidRedirectUrl', () => {
    test('should return the URL if it is valid', () => {
      expect(getValidRedirectUrl('/dashboard')).toBe('/dashboard');
      expect(getValidRedirectUrl('/docs/guide')).toBe('/docs/guide');
    });

    test('should return fallback if URL is invalid', () => {
      expect(getValidRedirectUrl('https://example.com')).toBe('/');
      expect(getValidRedirectUrl('')).toBe('/');
      expect(getValidRedirectUrl(null)).toBe('/');
      expect(getValidRedirectUrl(undefined)).toBe('/');
      expect(getValidRedirectUrl('/signin')).toBe('/');
    });

    test('should return custom fallback if provided', () => {
      expect(getValidRedirectUrl('https://example.com', '/home')).toBe('/home');
      expect(getValidRedirectUrl(null, '/default')).toBe('/default');
    });
  });
});