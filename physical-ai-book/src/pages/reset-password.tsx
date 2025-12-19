import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePassword, validatePasswordConfirmation } from '../utils/validation';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { initializeSupabase } from '../services/supabase';
import '../components/auth/auth.css';

type Mode = 'request' | 'reset';

const ResetPasswordPage: React.FC = () => {
  const [mode, setMode] = useState<Mode>('request');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { resetPassword } = useAuth();
  const { siteConfig } = useDocusaurusContext();
  const signinUrl = `${siteConfig.baseUrl}signin`;

  // Check if user came from password reset email (has access token in hash)
  useEffect(() => {
    const checkResetToken = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');

      if (accessToken && type === 'recovery') {
        // User clicked password reset link - switch to reset mode
        setMode('reset');

        // Set the session so user can update password
        try {
          const customFields = siteConfig.customFields as { supabaseUrl?: string; supabaseAnonKey?: string };
          const supabase = initializeSupabase({
            url: customFields?.supabaseUrl || '',
            anonKey: customFields?.supabaseAnonKey || ''
          });

          const refreshToken = hashParams.get('refresh_token');
          if (refreshToken) {
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
          }
        } catch (err) {
          console.error('Error setting session:', err);
        }
      }
    };

    checkResetToken();
  }, [siteConfig]);

  // Handle form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (mode === 'request') {
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        newErrors.email = emailValidation.message || 'Invalid email';
      }
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.message || 'Invalid password';
      }

      const confirmValidation = validatePasswordConfirmation(password, confirmPassword);
      if (!confirmValidation.isValid) {
        newErrors.confirmPassword = confirmValidation.message || 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle request reset email
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await resetPassword(email);
      setSuccess('Password reset link sent! Check your email inbox.');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle password update
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const customFields = siteConfig.customFields as { supabaseUrl?: string; supabaseAnonKey?: string };
      const supabase = initializeSupabase({
        url: customFields?.supabaseUrl || '',
        anonKey: customFields?.supabaseAnonKey || ''
      });

      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        throw error;
      }

      setSuccess('Password updated successfully! Redirecting to sign in...');

      // Redirect to signin after 2 seconds
      setTimeout(() => {
        window.location.href = signinUrl;
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Reset Password" description="Reset your account password">
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>{mode === 'request' ? 'Forgot password?' : 'Create new password'}</h1>
              <p>
                {mode === 'request'
                  ? 'Enter your email to receive a reset link'
                  : 'Enter your new password below'
                }
              </p>
            </div>

            {error && <div className="auth-alert">{error}</div>}

            {success && (
              <div className="auth-success-alert" style={{
                padding: '12px 16px',
                borderRadius: '10px',
                background: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                color: 'var(--ifm-color-primary)',
                fontSize: '14px',
                marginBottom: '20px'
              }}>
                {success}
              </div>
            )}

            <form
              onSubmit={mode === 'request' ? handleRequestReset : handleUpdatePassword}
              className="auth-form"
            >
              {mode === 'request' ? (
                <div className="auth-form-group">
                  <label htmlFor="email" className="auth-label">Email address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`auth-input ${errors.email ? 'error' : ''}`}
                    placeholder="you@example.com"
                  />
                  {errors.email && <div className="auth-error">{errors.email}</div>}
                </div>
              ) : (
                <>
                  <div className="auth-form-group">
                    <label htmlFor="password" className="auth-label">New password</label>
                    <div className="auth-input-wrapper">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`auth-input ${errors.password ? 'error' : ''}`}
                        placeholder="At least 8 characters"
                        style={{ paddingRight: '44px' }}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.password && <div className="auth-error">{errors.password}</div>}
                  </div>

                  <div className="auth-form-group">
                    <label htmlFor="confirmPassword" className="auth-label">Confirm new password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`auth-input ${errors.confirmPassword ? 'error' : ''}`}
                      placeholder="Re-enter your password"
                    />
                    {errors.confirmPassword && <div className="auth-error">{errors.confirmPassword}</div>}
                  </div>
                </>
              )}

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading
                  ? (mode === 'request' ? 'Sending...' : 'Updating...')
                  : (mode === 'request' ? 'Send reset link' : 'Update password')
                }
              </button>

              {loading && (
                <div className="auth-loading">
                  <div className="auth-spinner"></div>
                  <span>{mode === 'request' ? 'Sending email...' : 'Updating password...'}</span>
                </div>
              )}
            </form>

            <div className="auth-divider">
              <span>Remember your password?</span>
            </div>

            <button
              type="button"
              className="auth-secondary-btn"
              onClick={() => window.location.href = signinUrl}
            >
              Back to Sign in
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPasswordPage;