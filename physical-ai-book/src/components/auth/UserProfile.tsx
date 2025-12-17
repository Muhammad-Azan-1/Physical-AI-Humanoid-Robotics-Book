import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { validateName, validateDisplayName, validateBio, validateUrl } from '../../utils/validation';
import ErrorMessage from '../common/ErrorMessage';
import LoadingSpinner from '../common/LoadingSpinner';

interface UserProfileProps {
  userId?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const { user, loading: authLoading, updateProfile } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    display_name: '',
    avatar_url: '',
    bio: '',
    theme: 'light',
    notifications: {
      email: true,
      push: true
    }
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [generalError, setGeneralError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // In a real implementation, we would fetch the user profile from the database
        // For now, we'll use the user data from auth context
        if (user) {
          setProfile(user);
          setFormData({
            first_name: user.profile?.first_name || '',
            last_name: user.profile?.last_name || '',
            display_name: user.profile?.display_name || '',
            avatar_url: user.profile?.avatar_url || '',
            bio: user.profile?.bio || '',
            theme: user.profile?.preferences?.theme || 'light',
            notifications: user.profile?.preferences?.notifications || {
              email: true,
              push: true
            }
          });
        }
      } catch (error: any) {
        setGeneralError(error.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      loadProfile();
    }
  }, [user, authLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      const [parent, child] = name.split('.');

      if (child) {
        setFormData(prev => {
          const parentValue = prev[parent as keyof typeof prev];
          // Ensure parentValue is an object before spreading
          if (typeof parentValue === 'object' && parentValue !== null) {
            return {
              ...prev,
              [parent]: {
                ...parentValue,
                [child]: target.checked
              }
            };
          } else {
            // If parentValue is not an object, just set the child value
            return {
              ...prev,
              [parent]: {
                [child]: target.checked
              }
            };
          }
        });
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: target.checked
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate first name if provided
    if (formData.first_name) {
      const firstNameValidation = validateName(formData.first_name);
      if (!firstNameValidation.isValid) {
        newErrors.first_name = firstNameValidation.message || '';
      }
    }

    // Validate last name if provided
    if (formData.last_name) {
      const lastNameValidation = validateName(formData.last_name);
      if (!lastNameValidation.isValid) {
        newErrors.last_name = lastNameValidation.message || '';
      }
    }

    // Validate display name if provided
    if (formData.display_name) {
      const displayNameValidation = validateDisplayName(formData.display_name);
      if (!displayNameValidation.isValid) {
        newErrors.display_name = displayNameValidation.message || '';
      }
    }

    // Validate bio
    const bioValidation = validateBio(formData.bio);
    if (!bioValidation.isValid) {
      newErrors.bio = bioValidation.message || '';
    }

    // Validate avatar URL if provided
    if (formData.avatar_url) {
      const urlValidation = validateUrl(formData.avatar_url);
      if (!urlValidation.isValid) {
        newErrors.avatar_url = urlValidation.message || '';
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

    setSaving(true);
    setGeneralError('');
    setSaveSuccess(false);

    try {
      // Update the profile in the database
      const updatedProfile = await updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        display_name: formData.display_name,
        avatar_url: formData.avatar_url,
        bio: formData.bio,
        preferences: {
          theme: formData.theme as 'light' | 'dark',
          notifications: formData.notifications
        }
      });

      if (updatedProfile) {
        setSaveSuccess(true);
      }
    } catch (error: any) {
      setGeneralError(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingSpinner centered message="Loading profile..." />;
  }

  if (!user) {
    return <div>Please sign in to view your profile.</div>;
  }

  return (
    <div className="user-profile-container">
      <h2>User Profile</h2>

      {generalError && <ErrorMessage message={generalError} />}

      {saveSuccess && (
        <div className="alert alert--success" role="alert">
          Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={`form-control ${errors.first_name ? 'error' : ''}`}
              placeholder="Your first name"
            />
            {errors.first_name && <div className="error-message">{errors.first_name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={`form-control ${errors.last_name ? 'error' : ''}`}
              placeholder="Your last name"
            />
            {errors.last_name && <div className="error-message">{errors.last_name}</div>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="display_name">Display Name</label>
          <input
            type="text"
            id="display_name"
            name="display_name"
            value={formData.display_name}
            onChange={handleChange}
            className={`form-control ${errors.display_name ? 'error' : ''}`}
            placeholder="How you'd like to be known"
          />
          {errors.display_name && <div className="error-message">{errors.display_name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email || ''}
            disabled
            className="form-control"
          />
          <small className="form-text">Email cannot be changed here. Contact support to update your email.</small>
        </div>

        <div className="form-group">
          <label htmlFor="avatar_url">Avatar URL</label>
          <input
            type="text"
            id="avatar_url"
            name="avatar_url"
            value={formData.avatar_url}
            onChange={handleChange}
            className={`form-control ${errors.avatar_url ? 'error' : ''}`}
            placeholder="URL to your profile picture"
          />
          {errors.avatar_url && <div className="error-message">{errors.avatar_url}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className={`form-control ${errors.bio ? 'error' : ''}`}
            placeholder="Tell us about yourself"
            rows={4}
          />
          {errors.bio && <div className="error-message">{errors.bio}</div>}
          <small className="form-text">Maximum 500 characters</small>
        </div>

        <div className="form-group">
          <label htmlFor="theme">Theme Preference</label>
          <select
            id="theme"
            name="theme"
            value={formData.theme}
            onChange={handleThemeChange}
            className="form-control"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div className="form-group">
          <h3>Notification Preferences</h3>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="notifications.email"
                checked={formData.notifications.email}
                onChange={handleChange}
              />
              Email notifications
            </label>
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="notifications.push"
                checked={formData.notifications.push}
                onChange={handleChange}
              />
              Push notifications
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>

        {saving && <LoadingSpinner size="small" message="Saving profile..." />}
      </form>
    </div>
  );
};

export default UserProfile;