import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword, validatePasswordConfirmation } from '../../utils/validation';
import './auth.css';

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToSignin?: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, onSwitchToSignin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { signUp } = useAuth();

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

    if (formData.username.trim() === '') {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Only letters, numbers, and underscores allowed';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message || '';
    }

    const passwordConfirmationValidation = validatePasswordConfirmation(formData.password, formData.confirmPassword);
    if (!passwordConfirmationValidation.isValid) {
      newErrors.confirmPassword = passwordConfirmationValidation.message || '';
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
      await signUp(
        formData.email,
        formData.password,
        { username: formData.username }
      );

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setGeneralError(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          />
          {errors.email && <div className="auth-error">{errors.email}</div>}
        </div>

        <div className="auth-form-group">
          <label htmlFor="username" className="auth-label">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`auth-input ${errors.username ? 'error' : ''}`}
            placeholder="Choose a username"
          />
          {errors.username && <div className="auth-error">{errors.username}</div>}
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
              placeholder="At least 8 characters"
              style={{ paddingRight: '44px' }}
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

        <div className="auth-form-group">
          <label htmlFor="confirmPassword" className="auth-label">Confirm password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`auth-input ${errors.confirmPassword ? 'error' : ''}`}
            placeholder="Re-enter your password"
          />
          {errors.confirmPassword && <div className="auth-error">{errors.confirmPassword}</div>}
        </div>

        <button
          type="submit"
          className="auth-submit-btn"
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        {loading && (
          <div className="auth-loading">
            <div className="auth-spinner"></div>
            <span>Creating your account...</span>
          </div>
        )}
      </form>

      <div className="auth-divider">
        <span>Already have an account?</span>
      </div>

      <button
        type="button"
        className="auth-secondary-btn"
        onClick={onSwitchToSignin}
      >
        Sign in
      </button>
    </div>
  );
};

export default SignupForm;