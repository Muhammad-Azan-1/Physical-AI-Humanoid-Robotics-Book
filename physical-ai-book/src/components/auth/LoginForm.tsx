import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword } from '../../utils/validation';
import './auth.css';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
  onForgotPassword?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToSignup, onForgotPassword }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { signIn } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.message || '';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message || '';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setGeneralError('');

    try {
      await signIn(formData.email, formData.password);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      setGeneralError(error.message || 'An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const emailInput = document.getElementById('email') as HTMLInputElement;
    if (emailInput) {
      emailInput.focus();
    }
  }, []);

  return (
    <div className="auth-form-wrapper">
      {generalError && (
        <div className="auth-alert">{generalError}</div>
      )}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div className="auth-form-group">
          <label htmlFor="email" className="auth-label">Email address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`auth-input ${errors.email ? 'error' : ''}`}
            placeholder="you@example.com"
            required
          />
          {errors.email && <div className="auth-error">{errors.email}</div>}
        </div>

        <div className="auth-form-group">
          <label htmlFor="password" className="auth-label">Password</label>
          <div className="auth-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`auth-input ${errors.password ? 'error' : ''}`}
              placeholder="Enter your password"
              style={{ paddingRight: '44px' }}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
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

        <button
          type="button"
          className="auth-forgot-link"
          onClick={onForgotPassword}
        >
          Forgot password?
        </button>

        <button
          type="submit"
          className="auth-submit-btn"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        {loading && (
          <div className="auth-loading">
            <div className="auth-spinner"></div>
            <span>Authenticating...</span>
          </div>
        )}
      </form>

      <div className="auth-divider">
        <span>Don't have an account?</span>
      </div>

      <button
        type="button"
        className="auth-secondary-btn"
        onClick={onSwitchToSignup}
      >
        Create an account
      </button>
    </div>
  );
};

export default LoginForm;