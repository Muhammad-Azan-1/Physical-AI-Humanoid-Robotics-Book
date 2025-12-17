import {
  captureReturnUrl,
  constructAuthUrlWithReturn,
  getReturnUrlFromParams,
  isAuthPage
} from '../returnUrlUtils';

// Mock window.location for testing
const mockWindowLocation = (pathname: string, search: string = '') => {
  Object.defineProperty(window, 'location', {
    value: {
      pathname,
      search,
      href: `http://localhost${pathname}${search}`,
    },
    writable: true,
  });
};

describe('Return URL Utilities', () => {
  beforeEach(() => {
    // Reset window.location mock
    mockWindowLocation('/');
  });

  describe('captureReturnUrl', () => {
    test('should capture current pathname and search parameters', () => {
      mockWindowLocation('/docs/guide', '?section=1');
      expect(captureReturnUrl()).toBe('/docs/guide?section=1');
    });

    test('should return / when on root path', () => {
      mockWindowLocation('/');
      expect(captureReturnUrl()).toBe('/');
    });

    test('should work without search parameters', () => {
      mockWindowLocation('/profile');
      expect(captureReturnUrl()).toBe('/profile');
    });
  });

  describe('constructAuthUrlWithReturn', () => {
    test('should construct URL with return parameter', () => {
      mockWindowLocation('/docs/guide');
      expect(constructAuthUrlWithReturn('/signin')).toBe('/signin?returnUrl=%2Fdocs%2Fguide');
    });

    test('should preserve existing query parameters', () => {
      mockWindowLocation('/docs/guide?section=1');
      expect(constructAuthUrlWithReturn('/signin')).toBe('/signin?returnUrl=%2Fdocs%2Fguide%3Fsection%3D1');
    });

    test('should use provided return URL if given', () => {
      mockWindowLocation('/docs/guide');
      expect(constructAuthUrlWithReturn('/signin', '/custom-return')).toBe('/signin?returnUrl=%2Fcustom-return');
    });

    test('should not add return URL for auth pages', () => {
      mockWindowLocation('/signin');
      expect(constructAuthUrlWithReturn('/signup')).toBe('/signup');

      mockWindowLocation('/docs/guide');
      expect(constructAuthUrlWithReturn('/signin', '/signin')).toBe('/signin');
    });
  });

  describe('getReturnUrlFromParams', () => {
    test('should extract returnUrl from query parameters', () => {
      Object.defineProperty(window, 'location', {
        value: {
          search: '?returnUrl=%2Fdocs%2Fguide',
        },
        writable: true,
      });
      expect(getReturnUrlFromParams()).toBe('/docs/guide');
    });

    test('should return null if no returnUrl parameter', () => {
      Object.defineProperty(window, 'location', {
        value: {
          search: '?otherParam=value',
        },
        writable: true,
      });
      expect(getReturnUrlFromParams()).toBeNull();
    });

    test('should return null if no query parameters', () => {
      Object.defineProperty(window, 'location', {
        value: {
          search: '',
        },
        writable: true,
      });
      expect(getReturnUrlFromParams()).toBeNull();
    });
  });

  describe('isAuthPage', () => {
    test('should return true for signin page', () => {
      mockWindowLocation('/signin');
      expect(isAuthPage()).toBe(true);
    });

    test('should return true for signup page', () => {
      mockWindowLocation('/signup');
      expect(isAuthPage()).toBe(true);
    });

    test('should return true for auth pages', () => {
      mockWindowLocation('/auth/callback');
      expect(isAuthPage()).toBe(true);
    });

    test('should return false for non-auth pages', () => {
      mockWindowLocation('/docs/guide');
      expect(isAuthPage()).toBe(false);

      mockWindowLocation('/dashboard');
      expect(isAuthPage()).toBe(false);

      mockWindowLocation('/');
      expect(isAuthPage()).toBe(false);
    });
  });
});