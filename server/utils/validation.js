const validator = require('validator');

// Validate email
const isValidEmail = (email) => {
  return validator.isEmail(email);
};

// Validate password strength
const isValidPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Validate username
const isValidUsername = (username) => {
  // 3-30 characters, alphanumeric, underscore, hyphen
  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
  return usernameRegex.test(username);
};

// Validate age (must be 18+)
const isValidAge = (dateOfBirth) => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age >= 18;
};

// Validate URL
const isValidURL = (url) => {
  return validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true
  });
};

// Validate MongoDB ObjectId
const isValidObjectId = (id) => {
  return validator.isMongoId(id);
};

// Sanitize HTML content
const sanitizeHTML = (html) => {
  return validator.escape(html);
};

// Validate file type
const isValidImageType = (mimetype) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return allowedTypes.includes(mimetype);
};

const isValidVideoType = (mimetype) => {
  const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'];
  return allowedTypes.includes(mimetype);
};

// Validate file size (in bytes)
const isValidFileSize = (size, maxSize = 500 * 1024 * 1024) => { // Default 500MB
  return size <= maxSize;
};

// Validate content title
const isValidContentTitle = (title) => {
  return title && title.trim().length >= 3 && title.trim().length <= 100;
};

// Validate content description
const isValidContentDescription = (description) => {
  return !description || description.length <= 2000;
};

// Validate content tags
const isValidContentTags = (tags) => {
  if (!Array.isArray(tags)) return false;
  if (tags.length > 10) return false;
  
  return tags.every(tag => 
    typeof tag === 'string' && 
    tag.trim().length > 0 && 
    tag.trim().length <= 30
  );
};

// Validate subscription tier
const isValidSubscriptionTier = (tier) => {
  const validTiers = ['basic', 'premium', 'vip'];
  return validTiers.includes(tier);
};

// Validate billing cycle
const isValidBillingCycle = (cycle) => {
  const validCycles = ['monthly', 'quarterly', 'yearly'];
  return validCycles.includes(cycle);
};

// Validate price
const isValidPrice = (price) => {
  return typeof price === 'number' && price >= 0 && price <= 9999.99;
};

// Validate comment content
const isValidCommentContent = (content) => {
  return content && content.trim().length >= 1 && content.trim().length <= 1000;
};

// Validate report reason
const isValidReportReason = (reason) => {
  const validReasons = [
    'inappropriate-content',
    'copyright-violation',
    'spam',
    'harassment',
    'underage',
    'non-consensual',
    'violence',
    'other'
  ];
  return validReasons.includes(reason);
};

// Validate user role
const isValidUserRole = (role) => {
  const validRoles = ['viewer', 'creator', 'admin'];
  return validRoles.includes(role);
};

// Validate pagination parameters
const validatePagination = (page, limit) => {
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;
  
  return {
    page: Math.max(1, pageNum),
    limit: Math.min(100, Math.max(1, limitNum))
  };
};

// Clean and validate search query
const validateSearchQuery = (query) => {
  if (!query || typeof query !== 'string') return null;
  
  const cleaned = query.trim();
  if (cleaned.length < 1 || cleaned.length > 100) return null;
  
  // Remove potentially harmful characters
  return cleaned.replace(/[<>]/g, '');
};

// Validation middleware factory
const createValidationMiddleware = (validationRules) => {
  return (req, res, next) => {
    const errors = [];
    
    for (const [field, rules] of Object.entries(validationRules)) {
      const value = req.body[field];
      
      for (const rule of rules) {
        if (!rule.validator(value)) {
          errors.push({
            field,
            message: rule.message
          });
          break;
        }
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    next();
  };
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidUsername,
  isValidAge,
  isValidURL,
  isValidObjectId,
  sanitizeHTML,
  isValidImageType,
  isValidVideoType,
  isValidFileSize,
  isValidContentTitle,
  isValidContentDescription,
  isValidContentTags,
  isValidSubscriptionTier,
  isValidBillingCycle,
  isValidPrice,
  isValidCommentContent,
  isValidReportReason,
  isValidUserRole,
  validatePagination,
  validateSearchQuery,
  createValidationMiddleware
};