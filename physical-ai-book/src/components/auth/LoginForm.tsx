import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword } from '../../utils/validation';
import ErrorMessage from '../common/ErrorMessage';
import LoadingSpinner from '../common/LoadingSpinner';

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
  const [rememberMe, setRememberMe] = useState(false);

  const { signIn } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox' && name === 'remember') {
      setRememberMe(checked);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.message || '';
    }

    // Validate password
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
      // Focus on the first error field
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) element.focus();
      }
      return;
    }

    setLoading(true);
    setGeneralError('');

    try {
      await signIn(formData.email, formData.password);

      // On success, call the success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      setGeneralError(error.message || 'An error occurred during login. Please try again.');
      // Focus back to the form for screen readers
      const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (submitButton) submitButton.focus();
    } finally {
      setLoading(false);
    }
  };

  // Focus the email field when the component mounts
  useEffect(() => {
    const emailInput = document.getElementById('email') as HTMLInputElement;
    if (emailInput) {
      emailInput.focus();
    }
  }, []);

  return (
    <div className="login-form-container" role="region" aria-label="Login form">
      <h2 tabIndex={-1}>Sign In</h2>

      {generalError && <ErrorMessage message={generalError} />}

      <form onSubmit={handleSubmit} className="login-form" noValidate>
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-control ${errors.email ? 'error' : ''}`}
            placeholder="your@email.com"
            aria-describedby={errors.email ? "email-error" : undefined}
            required
          />
          {errors.email && (
            <div id="email-error" className="error-message" aria-live="polite">
              {errors.email}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`form-control ${errors.password ? 'error' : ''}`}
            placeholder="Your password"
            aria-describedby={errors.password ? "password-error" : undefined}
            required
          />
          {errors.password && (
            <div id="password-error" className="error-message" aria-live="polite">
              {errors.password}
            </div>
          )}
        </div>

        <div className="form-group form-group--flex">
          <label htmlFor="remember" className="checkbox-label">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              checked={rememberMe}
              onChange={handleChange}
            />
            Remember me
          </label>

          <button
            type="button"
            className="link-button"
            onClick={onForgotPassword}
            aria-label="Forgot password? Reset your password"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        {loading && <LoadingSpinner size="small" message="Authenticating..." />}
      </form>

      <div className="form-footer">
        <p>
          Don't have an account?{' '}
          <button
            type="button"
            className="link-button"
            onClick={onSwitchToSignup}
            aria-label="Sign up for a new account"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;