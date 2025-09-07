# Utils Folder - Complete Implementation

## Server-Side Utils (/server/utils/)

### ✅ Core Utility Files Created:

1. **`helpers.js`** - General utility functions
   - String manipulation (capitalize, truncate, slugify)
   - File operations (formatFileSize, generateUniqueFilename)
   - Date/time formatting (formatDuration, parseDuration)
   - Pagination helpers (getPagination, sanitizePagination)
   - API response builders (successResponse, errorResponse)
   - Security functions (encrypt, decrypt, generateHash)
   - Performance utilities (retry, delay, measurePerformance)

2. **`constants.js`** - Application constants
   - HTTP status codes
   - User roles and subscription tiers
   - Media types and categories
   - Rate limiting configurations
   - Error and success messages
   - Regex patterns
   - Time constants

3. **`database.js`** - Database utilities
   - Connection management
   - Health checks and statistics
   - Index management
   - Transaction helpers
   - Backup and optimization
   - Migration and seeding utilities

4. **`security.js`** - Security utilities
   - Password hashing and verification
   - Token generation and validation
   - HMAC signatures
   - Data encryption/decryption
   - Input sanitization
   - Rate limiting configurations
   - XSS and injection protection

5. **`validation.js`** - Input validation (already existed)
6. **`logger.js`** - Logging utilities (already existed)
7. **`jwt.js`** - JWT utilities (already existed)
8. **`email.js`** - Email utilities (already existed)
9. **`cloudinary.js`** - Cloudinary integration (already existed)

## Client-Side Utils (/client/src/utils/)

### ✅ Core Utility Files Created:

1. **`helpers.js`** - General client-side utilities
   - Date/time formatting (formatDate, formatRelativeTime)
   - Number formatting (formatNumber, formatCurrency)
   - String manipulation (capitalize, truncate, slugify)
   - Array and object helpers
   - Device detection (isMobile, isTablet, isDesktop)
   - Performance utilities (debounce, throttle)
   - Copy to clipboard functionality

2. **`constants.js`** - Client-side constants
   - API configuration
   - App settings and metadata
   - User roles and subscription tiers
   - Media types and categories
   - UI constants (breakpoints, colors, animations)
   - Error and success messages
   - Routes and navigation
   - Feature flags

3. **`validation.js`** - Client-side validation
   - Email, password, username validation
   - Age verification
   - Content validation (title, description, comments)
   - File validation (type, size, format)
   - Form validation helpers
   - Credit card validation
   - Input sanitization

4. **`storage.js`** - Storage utilities
   - LocalStorage wrapper with error handling
   - SessionStorage wrapper
   - Enhanced storage with expiration
   - Cookie utilities
   - Cache management with size limits
   - User preferences storage
   - Search history management
   - Viewed content tracking
   - Storage quota management

5. **`api.js`** - API client utilities
   - Axios instance configuration
   - Request/response interceptors
   - Error handling and retry logic
   - Request queue management
   - Caching for GET requests
   - WebSocket manager
   - Upload progress tracking
   - Batch request processing

6. **`media.js`** - Media processing utilities
   - Video utilities (duration, dimensions, thumbnails)
   - Image utilities (resize, crop, convert)
   - File utilities (validation, reading, formatting)
   - Media player utilities
   - Stream utilities (recording, user media)
   - Compression utilities
   - Media validation

## Key Features Implemented:

### Server-Side Features:
- **Database Management**: Connection pooling, health checks, migrations
- **Security**: Password hashing, token management, rate limiting
- **File Processing**: Cloudinary integration, file validation
- **Email System**: Template-based emails, multiple providers
- **Logging**: Structured logging with multiple levels
- **Validation**: Comprehensive input validation and sanitization

### Client-Side Features:
- **Storage Management**: LocalStorage, SessionStorage, cookies with expiration
- **API Communication**: Request queuing, caching, error handling
- **Media Processing**: Image/video manipulation, compression
- **Validation**: Real-time form validation, file validation
- **Performance**: Debouncing, throttling, lazy loading
- **User Experience**: Device detection, clipboard operations

## Usage Examples:

### Server-Side:
```javascript
// helpers.js
const { formatFileSize, generateSlug, successResponse } = require('./utils/helpers');

// constants.js
const { HTTP_STATUS, USER_ROLES, ERROR_MESSAGES } = require('./utils/constants');

// security.js
const { hashPassword, createRateLimit } = require('./utils/security');

// database.js
const { withTransaction, healthCheck } = require('./utils/database');
```

### Client-Side:
```javascript
// helpers.js
import { formatDate, formatCurrency, debounce } from './utils/helpers';

// constants.js
import { API_BASE_URL, USER_ROLES, MEDIA_TYPES } from './utils/constants';

// validation.js
import { validateEmail, validatePassword, validateFile } from './utils/validation';

// storage.js
import { localStorage, preferences, cache } from './utils/storage';

// api.js
import { apiClient, retryRequest, cachedApiClient } from './utils/api';

// media.js
import { videoUtils, imageUtils, compressionUtils } from './utils/media';
```

## Integration Notes:

1. **Error Handling**: All utility functions include proper error handling
2. **Performance**: Optimized for production use with caching and throttling
3. **Security**: Input sanitization and validation throughout
4. **Accessibility**: Support for various browsers and devices
5. **Maintainability**: Well-documented and modular code structure

The utils folders are now complete and provide a comprehensive foundation for the adult content platform with production-ready utilities for both server and client-side operations.