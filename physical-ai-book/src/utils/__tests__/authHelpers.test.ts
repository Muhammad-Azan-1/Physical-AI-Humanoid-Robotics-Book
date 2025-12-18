import { validateEmail, validatePassword, passwordsMatch, handleAuthError, isUserAuthenticated, sanitizeInput, isSessionValid, isValidRedirectUrl, getValidRedirectUrl, formatAuthErrorMessage } from '../authHelpers';

describe('authHelpers', () => {
  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should return true for strong passwords', () => {
      expect(validatePassword('StrongPass123!')).toBe(true);
      expect(validatePassword('Another123@')).toBe(true);
    });

    it('should return false for weak passwords', () => {
      expect(validatePassword('weak')).toBe(false);
      expect(validatePassword('NoNumbers!')).toBe(false);
      expect(validatePassword('NoSpecial123')).toBe(false);
      expect(validatePassword('')).toBe(false);
    });
  });

  describe('passwordsMatch', () => {
    it('should return true when passwords match', () => {
      expect(passwordsMatch('password123', 'password123')).toBe(true);
    });

    it('should return false when passwords do not match', () => {
      expect(passwordsMatch('password123', 'different')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should sanitize potentially harmful input', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x27;/script&gt;');
      expect(sanitizeInput('normal input')).toBe('normal input');
    });
  });

  describe('isValidRedirectUrl', () => {
    it('should return true for valid internal URLs', () => {
      expect(isValidRedirectUrl('/dashboard')).toBe(true);
      expect(isValidRedirectUrl('/profile/settings')).toBe(true);
    });

    it('should return false for external URLs', () => {
      expect(isValidRedirectUrl('https://example.com')).toBe(false);
      expect(isValidRedirectUrl('//example.com')).toBe(false);
      expect(isValidRedirectUrl('/signin')).toBe(false); // auth page
    });
  });

  describe('getValidRedirectUrl', () => {
    it('should return valid redirect URL or fallback', () => {
      expect(getValidRedirectUrl('/dashboard', '/')).toBe('/dashboard');
      expect(getValidRedirectUrl('https://example.com', '/')).toBe('/');
      expect(getValidRedirectUrl(null, '/')).toBe('/');
    });
  });
});