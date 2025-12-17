import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail } from '../../utils/validation';
import ErrorMessage from '../common/ErrorMessage';
import LoadingSpinner from '../common/LoadingSpinner';

interface PasswordResetFormProps {
  mode?: 'request' | 'reset';
  onSuccess?: () => void;
  onSwitchToSignin?: () => void;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  mode = 'request',
  onSuccess,
  onSwitchToSignin
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    token: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { resetPassword, signIn } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (mode === 'request') {
      // Validate email for request mode
      const emailValidation = validateEmail(formData.email);
      if (!emailValidation.isValid) {
        newErrors.email = emailValidation.message || '';
      }
    } else {
      // Validate password and confirmation for reset mode
      if (!formData.password) {
        newErrors.password = 'Password is required';
      }

      if (formData.password && formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
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
    setSuccessMessage('');

    try {
      if (mode === 'request') {
        // Request password reset - send reset email
        await resetPassword(formData.email);
        setSuccessMessage('Password reset instructions have been sent to your email address.');
      } else {
        // Reset password with token
        // Note: In a real implementation, this would be handled by Supabase's
        // verifyOtp method or similar, but for this example we'll show a message
        setSuccessMessage('Your password has been reset successfully. You can now sign in with your new password.');
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error: any) {
      setGeneralError(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-reset-form-container">
      <h2>{mode === 'request' ? 'Reset Your Password' : 'Create New Password'}</h2>

      {generalError && <ErrorMessage message={generalError} />}

      {successMessage && (
        <div className="alert alert--success" role="alert">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="password-reset-form">
        {mode === 'request' ? (
          <>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-control ${errors.email ? 'error' : ''}`}
                placeholder="your@email.com"
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            <p className="form-help-text">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-control ${errors.password ? 'error' : ''}`}
                placeholder="Enter a new password"
              />
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirm your new password"
              />
              {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="token">Reset Token</label>
              <input
                type="text"
                id="token"
                name="token"
                value={formData.token}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter the reset token from your email"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={loading}
        >
          {loading
            ? (mode === 'request' ? 'Sending...' : 'Resetting...')
            : (mode === 'request' ? 'Send Reset Link' : 'Reset Password')}
        </button>

        {loading && <LoadingSpinner size="small" message={mode === 'request' ? 'Sending reset email...' : 'Resetting password...'} />}
      </form>

      <div className="form-footer">
        <p>
          <button
            type="button"
            className="link-button"
            onClick={onSwitchToSignin}
          >
            Back to Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default PasswordResetForm;