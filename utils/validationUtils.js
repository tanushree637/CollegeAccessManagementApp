// utils/validationUtils.js

/**
 * Validation utilities for form inputs
 */

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Name validation regex (only letters and spaces, min 2 chars)
const NAME_REGEX = /^[a-zA-Z\s]{2,50}$/;

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const validateEmail = email => {
  if (!email || typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim());
};

/**
 * Validate full name
 * @param {string} name - Name to validate
 * @returns {boolean} - True if valid
 */
export const validateName = name => {
  if (!name || typeof name !== 'string') return false;
  return NAME_REGEX.test(name.trim());
};

/**
 * Validate role selection
 * @param {string} role - Role to validate
 * @returns {boolean} - True if valid
 */
export const validateRole = role => {
  const validRoles = ['teacher', 'student', 'guard'];
  return validRoles.includes(role);
};

/**
 * Comprehensive user data validation
 * @param {object} userData - User data object
 * @returns {object} - Validation result with errors
 */
export const validateUserData = userData => {
  const errors = {};
  const { fullName, email, role } = userData;

  // Validate full name
  if (!fullName || !fullName.trim()) {
    errors.fullName = 'Full name is required';
  } else if (!validateName(fullName)) {
    errors.fullName =
      'Full name should contain only letters and be 2-50 characters long';
  }

  // Validate email
  if (!email || !email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Validate role
  if (!role) {
    errors.role = 'Role selection is required';
  } else if (!validateRole(role)) {
    errors.role = 'Please select a valid role';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Format name for display (capitalize each word)
 * @param {string} name - Name to format
 * @returns {string} - Formatted name
 */
export const formatName = name => {
  if (!name) return '';
  return name
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Format email to lowercase and trim
 * @param {string} email - Email to format
 * @returns {string} - Formatted email
 */
export const formatEmail = email => {
  if (!email) return '';
  return email.trim().toLowerCase();
};

/**
 * Generate preview of college email
 * @param {string} fullName - User's full name
 * @param {string} role - User's role
 * @returns {string} - Preview of college email format
 */
export const generateEmailPreview = (fullName, role) => {
  if (!fullName || !role) return '';

  const cleanName = fullName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '.');

  const rolePrefix = role.charAt(0);

  return `${rolePrefix}.${cleanName}.XXX@college.edu`;
};
