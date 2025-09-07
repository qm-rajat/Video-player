// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
};

// User Roles
const USER_ROLES = {
  VIEWER: 'viewer',
  CREATOR: 'creator',
  ADMIN: 'admin'
};

// Subscription Tiers
const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  BASIC: 'basic',
  PREMIUM: 'premium',
  VIP: 'vip'
};

// Billing Cycles
const BILLING_CYCLES = {
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly'
};

// Payment Status
const PAYMENT_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  PAST_DUE: 'past_due',
  CANCELLED: 'cancelled',
  SUSPENDED: 'suspended'
};

// Media Types
const MEDIA_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
  GIF: 'gif'
};

// Media Categories
const MEDIA_CATEGORIES = {
  AMATEUR: 'amateur',
  PROFESSIONAL: 'professional',
  COUPLES: 'couples',
  SOLO_FEMALE: 'solo-female',
  SOLO_MALE: 'solo-male',
  GROUP: 'group',
  FETISH: 'fetish',
  BDSM: 'bdsm',
  ROLEPLAY: 'roleplay',
  VINTAGE: 'vintage',
  OTHER: 'other'
};

// Moderation Status
const MODERATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  UNDER_REVIEW: 'under-review',
  REMOVED: 'removed'
};

// Report Reasons
const REPORT_REASONS = {
  INAPPROPRIATE_CONTENT: 'inappropriate-content',
  COPYRIGHT_VIOLATION: 'copyright-violation',
  SPAM: 'spam',
  HARASSMENT: 'harassment',
  UNDERAGE: 'underage',
  NON_CONSENSUAL: 'non-consensual',
  VIOLENCE: 'violence',
  OTHER: 'other'
};

// Comment Report Reasons
const COMMENT_REPORT_REASONS = {
  SPAM: 'spam',
  HARASSMENT: 'harassment',
  INAPPROPRIATE: 'inappropriate',
  HATE_SPEECH: 'hate-speech',
  THREATS: 'threats',
  OTHER: 'other'
};

// File Upload Limits
const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 500 * 1024 * 1024, // 500MB
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_VIDEO_SIZE: 500 * 1024 * 1024, // 500MB
  MAX_FILES: 5,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov']
};

// Rate Limiting
const RATE_LIMITS = {
  GENERAL: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // requests per window
  },
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 // login attempts per window
  },
  UPLOAD: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10 // uploads per hour
  },
  API: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000 // API calls per window
  }
};

// Cache TTL (Time To Live) in seconds
const CACHE_TTL = {
  SHORT: 300, // 5 minutes
  MEDIUM: 1800, // 30 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400 // 24 hours
};

// Email Types
const EMAIL_TYPES = {
  WELCOME: 'welcome',
  EMAIL_VERIFICATION: 'email-verification',
  PASSWORD_RESET: 'password-reset',
  SUBSCRIPTION_CONFIRMATION: 'subscription-confirmation',
  CONTENT_APPROVED: 'content-approved',
  CONTENT_REJECTED: 'content-rejected',
  ACCOUNT_SUSPENDED: 'account-suspended',
  PAYMENT_FAILED: 'payment-failed'
};

// Notification Types
const NOTIFICATION_TYPES = {
  NEW_FOLLOWER: 'new-follower',
  NEW_SUBSCRIPTION: 'new-subscription',
  CONTENT_LIKED: 'content-liked',
  CONTENT_COMMENTED: 'content-commented',
  CONTENT_APPROVED: 'content-approved',
  CONTENT_REJECTED: 'content-rejected',
  PAYMENT_SUCCESS: 'payment-success',
  PAYMENT_FAILED: 'payment-failed',
  SYSTEM_ANNOUNCEMENT: 'system-announcement'
};

// Log Levels
const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  HTTP: 'http',
  VERBOSE: 'verbose',
  DEBUG: 'debug',
  SILLY: 'silly'
};

// Regex Patterns
const REGEX_PATTERNS = {
  EMAIL: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,30}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  PHONE: /^\+?[\d\s\-\(\)]{10,}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  MONGODB_ID: /^[0-9a-fA-F]{24}$/
};

// Default Pagination
const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100
};

// JWT Configuration
const JWT_CONFIG = {
  EXPIRES_IN: '7d',
  REFRESH_EXPIRES_IN: '30d',
  ALGORITHM: 'HS256'
};

// Cloudinary Folders
const CLOUDINARY_FOLDERS = {
  IMAGES: 'adult-content/images',
  VIDEOS: 'adult-content/videos',
  THUMBNAILS: 'adult-content/thumbnails',
  AVATARS: 'adult-content/avatars',
  COVERS: 'adult-content/covers'
};

// Content Visibility
const CONTENT_VISIBILITY = {
  PUBLIC: 'public',
  SUBSCRIBERS_ONLY: 'subscribers-only',
  PREMIUM_ONLY: 'premium-only',
  PRIVATE: 'private'
};

// Subscription Benefits
const SUBSCRIPTION_BENEFITS = {
  BASIC: [
    'Basic content access',
    'Standard quality streaming',
    'Community features'
  ],
  PREMIUM: [
    'All basic features',
    'Premium content access',
    'HD streaming',
    'Early access to new content',
    'Direct messaging'
  ],
  VIP: [
    'All premium features',
    'VIP content access',
    '4K streaming',
    'Custom requests',
    'Priority support',
    'Exclusive events'
  ]
};

// Error Messages
const ERROR_MESSAGES = {
  VALIDATION_FAILED: 'Validation failed',
  UNAUTHORIZED: 'Not authorized to access this route',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  ALREADY_EXISTS: 'Resource already exists',
  INVALID_CREDENTIALS: 'Invalid credentials',
  TOKEN_EXPIRED: 'Token expired',
  TOKEN_INVALID: 'Invalid token',
  FILE_TOO_LARGE: 'File too large',
  INVALID_FILE_TYPE: 'Invalid file type',
  RATE_LIMIT_EXCEEDED: 'Too many requests',
  SERVER_ERROR: 'Internal server error',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable'
};

// Success Messages
const SUCCESS_MESSAGES = {
  USER_REGISTERED: 'User registered successfully',
  USER_LOGGED_IN: 'Login successful',
  USER_LOGGED_OUT: 'Logged out successfully',
  PASSWORD_UPDATED: 'Password updated successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  CONTENT_UPLOADED: 'Content uploaded successfully',
  CONTENT_UPDATED: 'Content updated successfully',
  CONTENT_DELETED: 'Content deleted successfully',
  SUBSCRIPTION_CREATED: 'Subscription created successfully',
  SUBSCRIPTION_CANCELLED: 'Subscription cancelled successfully',
  EMAIL_SENT: 'Email sent successfully',
  REPORT_SUBMITTED: 'Report submitted successfully'
};

// Time Constants
const TIME_CONSTANTS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000
};

// API Versions
const API_VERSIONS = {
  V1: 'v1',
  V2: 'v2'
};

// Environment Types
const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production',
  TEST: 'test'
};

module.exports = {
  HTTP_STATUS,
  USER_ROLES,
  SUBSCRIPTION_TIERS,
  BILLING_CYCLES,
  PAYMENT_STATUS,
  MEDIA_TYPES,
  MEDIA_CATEGORIES,
  MODERATION_STATUS,
  REPORT_REASONS,
  COMMENT_REPORT_REASONS,
  UPLOAD_LIMITS,
  RATE_LIMITS,
  CACHE_TTL,
  EMAIL_TYPES,
  NOTIFICATION_TYPES,
  LOG_LEVELS,
  REGEX_PATTERNS,
  PAGINATION_DEFAULTS,
  JWT_CONFIG,
  CLOUDINARY_FOLDERS,
  CONTENT_VISIBILITY,
  SUBSCRIPTION_BENEFITS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  TIME_CONSTANTS,
  API_VERSIONS,
  ENVIRONMENTS
};