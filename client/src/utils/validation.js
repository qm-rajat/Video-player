import { REGEX_PATTERNS, CONTENT_LIMITS, UPLOAD_LIMITS, AGE_VERIFICATION } from './constants';

// Email validation
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }
  
  if (!REGEX_PATTERNS.EMAIL.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

// Password validation
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!REGEX_PATTERNS.PASSWORD.test(password)) {
    return { 
      isValid: false, 
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
    };
  }
  
  return { isValid: true };
};

// Password strength checker
export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, strength: 'none' };
  
  let score = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    longLength: password.length >= 12
  };
  
  score = Object.values(checks).filter(Boolean).length;
  
  let strength;
  if (score < 3) strength = 'weak';
  else if (score < 5) strength = 'medium';
  else strength = 'strong';
  
  return { score, strength, checks };
};

// Username validation
export const validateUsername = (username) => {
  if (!username) {
    return { isValid: false, message: 'Username is required' };
  }
  
  if (username.length < 3 || username.length > 30) {
    return { isValid: false, message: 'Username must be between 3 and 30 characters' };
  }
  
  if (!REGEX_PATTERNS.USERNAME.test(username)) {
    return { 
      isValid: false, 
      message: 'Username can only contain letters, numbers, underscores, and hyphens' 
    };
  }
  
  return { isValid: true };
};

// Age validation
export const validateAge = (dateOfBirth) => {
  if (!dateOfBirth) {
    return { isValid: false, message: 'Date of birth is required' };
  }
  
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  
  if (birthDate >= today) {
    return { isValid: false, message: 'Please enter a valid date of birth' };
  }
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  if (age < AGE_VERIFICATION.MIN_AGE) {
    return { 
      isValid: false, 
      message: `You must be at least ${AGE_VERIFICATION.MIN_AGE} years old to register` 
    };
  }
  
  return { isValid: true, age };
};

// URL validation
export const validateURL = (url) => {
  if (!url) return { isValid: true }; // URL is optional in most cases
  
  if (!REGEX_PATTERNS.URL.test(url)) {
    return { isValid: false, message: 'Please enter a valid URL' };
  }
  
  return { isValid: true };
};

// Phone validation
export const validatePhone = (phone) => {
  if (!phone) return { isValid: true }; // Phone is optional in most cases
  
  if (!REGEX_PATTERNS.PHONE.test(phone)) {
    return { isValid: false, message: 'Please enter a valid phone number' };
  }
  
  return { isValid: true };
};

// Content title validation
export const validateContentTitle = (title) => {
  if (!title) {
    return { isValid: false, message: 'Title is required' };
  }
  
  if (title.trim().length < 3) {
    return { isValid: false, message: 'Title must be at least 3 characters long' };
  }
  
  if (title.length > CONTENT_LIMITS.TITLE_MAX_LENGTH) {
    return { 
      isValid: false, 
      message: `Title must be less than ${CONTENT_LIMITS.TITLE_MAX_LENGTH} characters` 
    };
  }
  
  return { isValid: true };
};

// Content description validation
export const validateContentDescription = (description) => {
  if (!description) return { isValid: true }; // Description is optional
  
  if (description.length > CONTENT_LIMITS.DESCRIPTION_MAX_LENGTH) {
    return { 
      isValid: false, 
      message: `Description must be less than ${CONTENT_LIMITS.DESCRIPTION_MAX_LENGTH} characters` 
    };
  }
  
  return { isValid: true };
};

// Comment validation
export const validateComment = (comment) => {
  if (!comment) {
    return { isValid: false, message: 'Comment cannot be empty' };
  }
  
  if (comment.trim().length < 1) {
    return { isValid: false, message: 'Comment cannot be empty' };
  }
  
  if (comment.length > CONTENT_LIMITS.COMMENT_MAX_LENGTH) {
    return { 
      isValid: false, 
      message: `Comment must be less than ${CONTENT_LIMITS.COMMENT_MAX_LENGTH} characters` 
    };
  }
  
  return { isValid: true };
};

// Bio validation
export const validateBio = (bio) => {
  if (!bio) return { isValid: true }; // Bio is optional
  
  if (bio.length > CONTENT_LIMITS.BIO_MAX_LENGTH) {
    return { 
      isValid: false, 
      message: `Bio must be less than ${CONTENT_LIMITS.BIO_MAX_LENGTH} characters` 
    };
  }
  
  return { isValid: true };
};

// Tags validation
export const validateTags = (tags) => {
  if (!tags || !Array.isArray(tags)) return { isValid: true };
  
  if (tags.length > CONTENT_LIMITS.MAX_TAGS) {
    return { 
      isValid: false, 
      message: `You can add up to ${CONTENT_LIMITS.MAX_TAGS} tags` 
    };
  }
  
  for (const tag of tags) {
    if (typeof tag !== 'string') {
      return { isValid: false, message: 'All tags must be text' };
    }
    
    if (tag.trim().length === 0) {
      return { isValid: false, message: 'Tags cannot be empty' };
    }
    
    if (tag.length > CONTENT_LIMITS.TAG_MAX_LENGTH) {
      return { 
        isValid: false, 
        message: `Each tag must be less than ${CONTENT_LIMITS.TAG_MAX_LENGTH} characters` 
      };
    }
  }
  
  return { isValid: true };
};

// File validation
export const validateFile = (file, type = 'any') => {
  if (!file) {
    return { isValid: false, message: 'Please select a file' };
  }
  
  // Check file size
  let maxSize = UPLOAD_LIMITS.MAX_FILE_SIZE;
  if (type === 'image') {
    maxSize = UPLOAD_LIMITS.MAX_IMAGE_SIZE;
  } else if (type === 'video') {
    maxSize = UPLOAD_LIMITS.MAX_VIDEO_SIZE;
  }
  
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return { 
      isValid: false, 
      message: `File size must be less than ${maxSizeMB}MB` 
    };
  }
  
  // Check file type
  let allowedTypes = [...UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES, ...UPLOAD_LIMITS.ALLOWED_VIDEO_TYPES];
  if (type === 'image') {
    allowedTypes = UPLOAD_LIMITS.ALLOWED_IMAGE_TYPES;
  } else if (type === 'video') {
    allowedTypes = UPLOAD_LIMITS.ALLOWED_VIDEO_TYPES;
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` 
    };
  }
  
  return { isValid: true };
};

// Multiple files validation
export const validateFiles = (files, type = 'any', maxFiles = 5) => {
  if (!files || files.length === 0) {
    return { isValid: false, message: 'Please select at least one file' };
  }
  
  if (files.length > maxFiles) {
    return { 
      isValid: false, 
      message: `You can upload up to ${maxFiles} files at once` 
    };
  }
  
  for (let i = 0; i < files.length; i++) {
    const fileValidation = validateFile(files[i], type);
    if (!fileValidation.isValid) {
      return { 
        isValid: false, 
        message: `File ${i + 1}: ${fileValidation.message}` 
      };
    }
  }
  
  return { isValid: true };
};

// Price validation
export const validatePrice = (price) => {
  if (price === null || price === undefined || price === '') {
    return { isValid: true }; // Price is optional for free content
  }
  
  const numPrice = parseFloat(price);
  
  if (isNaN(numPrice)) {
    return { isValid: false, message: 'Price must be a valid number' };
  }
  
  if (numPrice < 0) {
    return { isValid: false, message: 'Price cannot be negative' };
  }
  
  if (numPrice > 999.99) {
    return { isValid: false, message: 'Price cannot exceed $999.99' };
  }
  
  return { isValid: true };
};

// Search query validation
export const validateSearchQuery = (query) => {
  if (!query) {
    return { isValid: false, message: 'Search query is required' };
  }
  
  if (query.trim().length < 2) {
    return { isValid: false, message: 'Search query must be at least 2 characters long' };
  }
  
  if (query.length > 100) {
    return { isValid: false, message: 'Search query must be less than 100 characters' };
  }
  
  return { isValid: true };
};

// Form validation helper
export const validateForm = (data, rules) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = data[field];
    
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors[field] = `${rule.label || field} is required`;
      isValid = false;
      return;
    }
    
    if (value && rule.validator) {
      const validation = rule.validator(value);
      if (!validation.isValid) {
        errors[field] = validation.message;
        isValid = false;
      }
    }
  });
  
  return { isValid, errors };
};

// Credit card validation (basic)
export const validateCreditCard = (cardNumber) => {
  if (!cardNumber) {
    return { isValid: false, message: 'Card number is required' };
  }
  
  // Remove spaces and dashes
  const cleanNumber = cardNumber.replace(/[\s-]/g, '');
  
  // Check if it's all digits
  if (!/^\d+$/.test(cleanNumber)) {
    return { isValid: false, message: 'Card number must contain only digits' };
  }
  
  // Check length
  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return { isValid: false, message: 'Card number must be between 13 and 19 digits' };
  }
  
  // Luhn algorithm check
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i), 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  if (sum % 10 !== 0) {
    return { isValid: false, message: 'Invalid card number' };
  }
  
  return { isValid: true };
};

// CVV validation
export const validateCVV = (cvv, cardType = 'visa') => {
  if (!cvv) {
    return { isValid: false, message: 'CVV is required' };
  }
  
  const cleanCVV = cvv.replace(/\D/g, '');
  
  if (cardType === 'amex' && cleanCVV.length !== 4) {
    return { isValid: false, message: 'American Express CVV must be 4 digits' };
  } else if (cardType !== 'amex' && cleanCVV.length !== 3) {
    return { isValid: false, message: 'CVV must be 3 digits' };
  }
  
  return { isValid: true };
};

// Expiry date validation
export const validateExpiryDate = (month, year) => {
  if (!month || !year) {
    return { isValid: false, message: 'Expiry date is required' };
  }
  
  const numMonth = parseInt(month, 10);
  const numYear = parseInt(year, 10);
  
  if (numMonth < 1 || numMonth > 12) {
    return { isValid: false, message: 'Invalid month' };
  }
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  
  if (numYear < currentYear || (numYear === currentYear && numMonth < currentMonth)) {
    return { isValid: false, message: 'Card has expired' };
  }
  
  return { isValid: true };
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Validate and sanitize all form inputs
export const sanitizeFormData = (formData) => {
  const sanitized = {};
  
  Object.keys(formData).forEach(key => {
    const value = formData[key];
    
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeInput(item) : item
      );
    } else {
      sanitized[key] = value;
    }
  });
  
  return sanitized;
};