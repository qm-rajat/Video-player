// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
export const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

// App Configuration
export const APP_NAME = 'AdultPlatform';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Premium Adult Content Platform';

// User Roles
export const USER_ROLES = {
  VIEWER: 'viewer',
  CREATOR: 'creator',
  ADMIN: 'admin'
};

// Subscription Tiers
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  BASIC: 'basic',
  PREMIUM: 'premium',
  VIP: 'vip'
};

// Billing Cycles
export const BILLING_CYCLES = {
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly'
};

// Payment Status
export const PAYMENT_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  PAST_DUE: 'past_due',
  CANCELLED: 'cancelled',
  SUSPENDED: 'suspended'
};

// Media Types
export const MEDIA_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
  GIF: 'gif'
};

// Media Categories
export const MEDIA_CATEGORIES = {
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

// Category Display Names
export const CATEGORY_LABELS = {
  [MEDIA_CATEGORIES.AMATEUR]: 'Amateur',
  [MEDIA_CATEGORIES.PROFESSIONAL]: 'Professional',
  [MEDIA_CATEGORIES.COUPLES]: 'Couples',
  [MEDIA_CATEGORIES.SOLO_FEMALE]: 'Solo Female',
  [MEDIA_CATEGORIES.SOLO_MALE]: 'Solo Male',
  [MEDIA_CATEGORIES.GROUP]: 'Group',
  [MEDIA_CATEGORIES.FETISH]: 'Fetish',
  [MEDIA_CATEGORIES.BDSM]: 'BDSM',
  [MEDIA_CATEGORIES.ROLEPLAY]: 'Roleplay',
  [MEDIA_CATEGORIES.VINTAGE]: 'Vintage',
  [MEDIA_CATEGORIES.OTHER]: 'Other'
};

// Sort Options
export const SORT_OPTIONS = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  POPULAR: 'popular',
  TRENDING: 'trending',
  MOST_LIKED: 'most-liked'
};

// Sort Labels
export const SORT_LABELS = {
  [SORT_OPTIONS.NEWEST]: 'Newest',
  [SORT_OPTIONS.OLDEST]: 'Oldest',
  [SORT_OPTIONS.POPULAR]: 'Most Popular',
  [SORT_OPTIONS.TRENDING]: 'Trending',
  [SORT_OPTIONS.MOST_LIKED]: 'Most Liked'
};

// Report Reasons
export const REPORT_REASONS = {
  INAPPROPRIATE_CONTENT: 'inappropriate-content',
  COPYRIGHT_VIOLATION: 'copyright-violation',
  SPAM: 'spam',
  HARASSMENT: 'harassment',
  UNDERAGE: 'underage',
  NON_CONSENSUAL: 'non-consensual',
  VIOLENCE: 'violence',
  OTHER: 'other'
};

// Report Labels
export const REPORT_LABELS = {
  [REPORT_REASONS.INAPPROPRIATE_CONTENT]: 'Inappropriate Content',
  [REPORT_REASONS.COPYRIGHT_VIOLATION]: 'Copyright Violation',
  [REPORT_REASONS.SPAM]: 'Spam',
  [REPORT_REASONS.HARASSMENT]: 'Harassment',
  [REPORT_REASONS.UNDERAGE]: 'Underage Content',
  [REPORT_REASONS.NON_CONSENSUAL]: 'Non-Consensual Content',
  [REPORT_REASONS.VIOLENCE]: 'Violence',
  [REPORT_REASONS.OTHER]: 'Other'
};

// File Upload Limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 500 * 1024 * 1024, // 500MB
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_VIDEO_SIZE: 500 * 1024 * 1024, // 500MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov']
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100
};

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
};

// Theme Colors
export const COLORS = {
  PRIMARY: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d'
  },
  DARK: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  }
};

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Modal Types
export const MODAL_TYPES = {
  CONFIRM: 'confirm',
  ALERT: 'alert',
  FORM: 'form',
  MEDIA_PLAYER: 'media-player',
  SUBSCRIPTION: 'subscription',
  REPORT: 'report'
};

// Loading States
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
  AGE_VERIFIED: 'age_verified',
  SEARCH_HISTORY: 'search_history',
  VIEWED_CONTENT: 'viewed_content'
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  PROFILE: '/profile',
  SEARCH: '/search',
  MEDIA: '/media/:id',
  SUBSCRIPTIONS: '/subscriptions',
  CREATOR_DASHBOARD: '/creator/dashboard',
  CREATOR_UPLOAD: '/creator/upload',
  ADMIN_PANEL: '/admin',
  LEGAL: '/legal/:page'
};

// Social Media Links
export const SOCIAL_LINKS = {
  TWITTER: 'https://twitter.com/adultplatform',
  INSTAGRAM: 'https://instagram.com/adultplatform',
  TELEGRAM: 'https://t.me/adultplatform',
  DISCORD: 'https://discord.gg/adultplatform'
};

// Support Links
export const SUPPORT_LINKS = {
  HELP: '/help',
  CONTACT: '/contact',
  FAQ: '/faq',
  PRIVACY: '/legal/privacy',
  TERMS: '/legal/terms',
  DMCA: '/legal/dmca',
  COMMUNITY_GUIDELINES: '/legal/community-guidelines'
};

// Video Player Settings
export const VIDEO_PLAYER = {
  DEFAULT_VOLUME: 0.8,
  SEEK_STEP: 10, // seconds
  VOLUME_STEP: 0.1,
  QUALITY_OPTIONS: ['auto', '1080p', '720p', '480p', '360p', '240p'],
  PLAYBACK_RATES: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
};

// Search Settings
export const SEARCH = {
  MIN_QUERY_LENGTH: 2,
  MAX_QUERY_LENGTH: 100,
  DEBOUNCE_DELAY: 300,
  MAX_SUGGESTIONS: 10,
  MAX_RECENT_SEARCHES: 20
};

// Content Limits
export const CONTENT_LIMITS = {
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 2000,
  COMMENT_MAX_LENGTH: 1000,
  BIO_MAX_LENGTH: 500,
  MAX_TAGS: 10,
  TAG_MAX_LENGTH: 30
};

// Age Verification
export const AGE_VERIFICATION = {
  MIN_AGE: 18,
  REQUIRED_FIELDS: ['dateOfBirth', 'agreeToTerms']
};

// Feature Flags
export const FEATURES = {
  DARK_MODE: true,
  LIVE_STREAMING: false,
  COMMENTS: true,
  LIKES: true,
  FAVORITES: true,
  SHARING: true,
  DOWNLOADS: false,
  OFFLINE_MODE: false
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access forbidden.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  FILE_TOO_LARGE: 'File is too large. Please choose a smaller file.',
  INVALID_FILE_TYPE: 'Invalid file type. Please choose a valid file.',
  AGE_VERIFICATION_REQUIRED: 'You must be 18 or older to access this content.',
  SUBSCRIPTION_REQUIRED: 'This content requires an active subscription.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  CONTENT_UPLOADED: 'Content uploaded successfully!',
  COMMENT_POSTED: 'Comment posted successfully!',
  SUBSCRIPTION_CREATED: 'Subscription created successfully!',
  REPORT_SUBMITTED: 'Report submitted successfully!',
  COPIED_TO_CLIPBOARD: 'Copied to clipboard!',
  EMAIL_SENT: 'Email sent successfully!'
};

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,30}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  PHONE: /^\+?[\d\s\-\(\)]{10,}$/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
};

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'MM/dd/yyyy',
  LONG: 'MMMM dd, yyyy',
  TIME: 'HH:mm',
  DATETIME: 'MM/dd/yyyy HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
};

// Currency Settings
export const CURRENCY = {
  DEFAULT: 'USD',
  SYMBOL: '$',
  SUPPORTED: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
};

// Language Settings
export const LANGUAGES = {
  DEFAULT: 'en',
  SUPPORTED: [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' }
  ]
};

// Analytics Events
export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  SIGN_UP: 'sign_up',
  LOGIN: 'login',
  LOGOUT: 'logout',
  CONTENT_VIEW: 'content_view',
  CONTENT_LIKE: 'content_like',
  CONTENT_SHARE: 'content_share',
  SUBSCRIPTION_START: 'subscription_start',
  SUBSCRIPTION_CANCEL: 'subscription_cancel',
  UPLOAD_START: 'upload_start',
  UPLOAD_COMPLETE: 'upload_complete',
  SEARCH: 'search',
  REPORT_CONTENT: 'report_content'
};

// Performance Thresholds
export const PERFORMANCE = {
  SLOW_NETWORK_THRESHOLD: 2000, // ms
  LARGE_FILE_THRESHOLD: 50 * 1024 * 1024, // 50MB
  MAX_CONCURRENT_UPLOADS: 3,
  CHUNK_SIZE: 1024 * 1024, // 1MB chunks for large file uploads
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000 // ms
};