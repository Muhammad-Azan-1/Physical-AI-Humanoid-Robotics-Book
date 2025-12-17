import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword, validatePasswordConfirmation, validateName, validateDisplayName } from '../../utils/validation';
import ErrorMessage from '../common/ErrorMessage';
import LoadingSpinner from '../common/LoadingSpinner';

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToSignin?: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess, onSwitchToSignin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    firstName: '',
    lastName: '',
    displayName: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const { signUp } = useAuth();

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

    // Validate password confirmation
    const passwordConfirmationValidation = validatePasswordConfirmation(formData.password, formData.confirmPassword);
    if (!passwordConfirmationValidation.isValid) {
      newErrors.confirmPassword = passwordConfirmationValidation.message || '';
    }

    // Validate first name if provided
    if (formData.firstName) {
      const firstNameValidation = validateName(formData.firstName);
      if (!firstNameValidation.isValid) {
        newErrors.firstName = firstNameValidation.message || '';
      }
    }

    // Validate last name if provided
    if (formData.lastName) {
      const lastNameValidation = validateName(formData.lastName);
      if (!lastNameValidation.isValid) {
        newErrors.lastName = lastNameValidation.message || '';
      }
    }

    // Validate username
    if (formData.username.trim() === '') {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 30) {
      newErrors.username = 'Username must be less than 30 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Validate display name if provided
    if (formData.displayName) {
      const displayNameValidation = validateDisplayName(formData.displayName);
      if (!displayNameValidation.isValid) {
        newErrors.displayName = displayNameValidation.message || '';
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

    try {
      await signUp(
        formData.email,
        formData.password,
        {
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
          displayName: formData.displayName
        }
      );

      // On success, call the success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setGeneralError(error.message || 'An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-form-container">
      <h2>Create Account</h2>

      {generalError && <ErrorMessage message={generalError} />}

      <form onSubmit={handleSubmit} className="signup-form">
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
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
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
            placeholder="At least 8 characters"
          />
          {errors.password && <div className="error-message">{errors.password}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password *</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
            placeholder="Re-enter your password"
          />
          {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="username">Username *</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`form-control ${errors.username ? 'error' : ''}`}
            placeholder="Choose a username"
          />
          {errors.username && <div className="error-message">{errors.username}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="firstName">First Name (optional)</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`form-control ${errors.firstName ? 'error' : ''}`}
            placeholder="Your first name"
          />
          {errors.firstName && <div className="error-message">{errors.firstName}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name (optional)</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`form-control ${errors.lastName ? 'error' : ''}`}
            placeholder="Your last name"
          />
          {errors.lastName && <div className="error-message">{errors.lastName}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="displayName">Display Name (optional)</label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            className={`form-control ${errors.displayName ? 'error' : ''}`}
            placeholder="How you'd like to be known"
          />
          {errors.displayName && <div className="error-message">{errors.displayName}</div>}
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        {loading && <LoadingSpinner size="small" message="Creating your account..." />}
      </form>

      <div className="form-footer">
        <p>
          Already have an account?{' '}
          <button
            type="button"
            className="link-button"
            onClick={onSwitchToSignin}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;