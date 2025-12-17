import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { User } from '../../types/auth';

// Mock the Docusaurus context before importing AuthContext
jest.mock('@docusaurus/useDocusaurusContext', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    siteConfig: {
      customFields: {
        SUPABASE_URL: 'https://test.supabase.co',
        SUPABASE_ANON_KEY: 'test-anon-key',
      },
    },
  })),
}));

import { AuthProvider, useAuth } from '../AuthContext';

// Mock Supabase
const mockSupabase = {
  auth: {
    getSession: jest.fn(),
    onAuthStateChange: jest.fn(() => ({
      data: { subscription: { unsubscribe: jest.fn() } }
    })),
    signOut: jest.fn(),
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    resetPasswordForEmail: jest.fn(),
    updateUser: jest.fn(),
  },
  from: jest.fn(() => ({
    upsert: jest.fn(),
  })),
};

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock storage event
const mockStorageEvent = (key: string, oldValue: string | null, newValue: string | null) => {
  const event = new StorageEvent('storage', {
    key,
    oldValue,
    newValue,
    url: window.location.href,
    storageArea: window.localStorage,
  });
  return event;
};

describe('AuthContext - Cross-Window Sync', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  const TestComponent = () => {
    const { isAuthenticated, emailVerificationState, verifyEmail } = useAuth();
    return (
      <div>
        <span data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</span>
        <span data-testid="verification-status">{emailVerificationState.verificationComplete ? 'verified' : 'not-verified'}</span>
      </div>
    );
  };

  it('should update auth state when localStorage changes from another window', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initially not authenticated
    expect(getByTestId('auth-status')).toHaveTextContent('not-authenticated');

    // Simulate another window setting auth state
    const authState = {
      event: 'SIGNED_IN',
      session: {
        user: { id: 'test-user-id', email: 'test@example.com' },
        expires_at: Date.now() + 3600000, // 1 hour from now
      },
      timestamp: Date.now(),
    };

    localStorage.setItem('auth-state', JSON.stringify(authState));

    // Dispatch storage event to simulate cross-window communication
    const event = mockStorageEvent('auth-state', null, JSON.stringify(authState));
    window.dispatchEvent(event);

    // Wait for the state to update
    await waitFor(() => {
      expect(getByTestId('auth-status')).toHaveTextContent('authenticated');
    });
  });

  it('should handle sign out from another window', async () => {
    // Set initial authenticated state
    const initialAuthState = {
      event: 'SIGNED_IN',
      session: {
        user: { id: 'test-user-id', email: 'test@example.com' },
        expires_at: Date.now() + 3600000,
      },
      timestamp: Date.now(),
    };
    localStorage.setItem('auth-state', JSON.stringify(initialAuthState));

    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'test-user-id', email: 'test@example.com' } } },
      error: null
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initially authenticated
    expect(getByTestId('auth-status')).toHaveTextContent('authenticated');

    // Simulate sign out from another window
    const signOutState = {
      event: 'SIGNED_OUT',
      session: null,
      timestamp: Date.now(),
    };

    localStorage.setItem('auth-state', JSON.stringify(signOutState));

    // Dispatch storage event
    const event = mockStorageEvent('auth-state', JSON.stringify(initialAuthState), JSON.stringify(signOutState));
    window.dispatchEvent(event);

    // Wait for the state to update
    await waitFor(() => {
      expect(getByTestId('auth-status')).toHaveTextContent('not-authenticated');
    });
  });
});