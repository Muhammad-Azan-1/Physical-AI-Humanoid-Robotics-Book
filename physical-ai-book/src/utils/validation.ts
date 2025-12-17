/**
 * Validates email format
 */
export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
  if (!email) {
    return { isValid: false, message: 'Email is required' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' }
  }

  return { isValid: true }
}

/**
 * Validates password strength
 */
export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (!password) {
    return { isValid: false, message: 'Password is required' }
  }

  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' }
  }

  if (password.length > 128) {
    return { isValid: false, message: 'Password must be less than 128 characters' }
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' }
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' }
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' }
  }

  // Check for at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character' }
  }

  return { isValid: true }
}

/**
 * Validates that password and confirmation match
 */
export const validatePasswordConfirmation = (
  password: string,
  confirmPassword: string
): { isValid: boolean; message?: string } => {
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match' }
  }

  return { isValid: true }
}

/**
 * Validates a full name field
 */
export const validateName = (name: string): { isValid: boolean; message?: string } => {
  if (!name) {
    return { isValid: false, message: 'Name is required' }
  }

  if (name.length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters long' }
  }

  if (name.length > 50) {
    return { isValid: false, message: 'Name must be less than 50 characters' }
  }

  // Check if name contains only letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(name)) {
    return { isValid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes' }
  }

  return { isValid: true }
}

/**
 * Validates a display name
 */
export const validateDisplayName = (displayName: string): { isValid: boolean; message?: string } => {
  if (!displayName) {
    return { isValid: false, message: 'Display name is required' }
  }

  if (displayName.length < 3) {
    return { isValid: false, message: 'Display name must be at least 3 characters long' }
  }

  if (displayName.length > 30) {
    return { isValid: false, message: 'Display name must be less than 30 characters' }
  }

  // Check if display name contains only alphanumeric characters, spaces, hyphens, underscores, and periods
  const displayNameRegex = /^[a-zA-Z0-9\s\-_.]+$/;
  if (!displayNameRegex.test(displayName)) {
    return { isValid: false, message: 'Display name can only contain letters, numbers, spaces, hyphens, underscores, and periods' }
  }

  return { isValid: true }
}

/**
 * Validates a URL
 */
export const validateUrl = (url: string): { isValid: boolean; message?: string } => {
  if (!url) {
    return { isValid: true } // URL is optional
  }

  try {
    new URL(url);
    return { isValid: true }
  } catch {
    return { isValid: false, message: 'Please enter a valid URL' }
  }
}

/**
 * Validates a bio/description field
 */
export const validateBio = (bio: string): { isValid: boolean; message?: string } => {
  if (bio.length > 500) {
    return { isValid: false, message: 'Bio must be less than 500 characters' }
  }

  return { isValid: true }
}

/**
 * Validates a generic form field
 */
export const validateField = (
  value: string,
  options: {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    customMessage?: string
  } = {}
): { isValid: boolean; message?: string } => {
  const { required = true, minLength, maxLength, pattern, customMessage } = options

  if (required && !value) {
    return { isValid: false, message: customMessage || 'This field is required' }
  }

  if (value && minLength && value.length < minLength) {
    return {
      isValid: false,
      message: customMessage || `This field must be at least ${minLength} characters long`
    }
  }

  if (value && maxLength && value.length > maxLength) {
    return {
      isValid: false,
      message: customMessage || `This field must be less than ${maxLength} characters`
    }
  }

  if (value && pattern && !pattern.test(value)) {
    return {
      isValid: false,
      message: customMessage || 'This field has invalid characters'
    }
  }

  return { isValid: true }
}

/**
 * Validates an entire form with multiple fields
 */
export const validateForm = (
  formData: Record<string, any>,
  validationRules: Record<string, (value: any) => { isValid: boolean; message?: string }>
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {}

  for (const [field, validator] of Object.entries(validationRules)) {
    const result = validator(formData[field])
    if (!result.isValid) {
      errors[field] = result.message || 'Invalid value'
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors }
}