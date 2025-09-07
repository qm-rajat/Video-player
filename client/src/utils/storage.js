// Local Storage utilities
export const localStorage = {
  // Set item in localStorage
  setItem: (key, value) => {
    try {
      const serializedValue = JSON.stringify(value);
      window.localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error setting localStorage item:', error);
    }
  },

  // Get item from localStorage
  getItem: (key, defaultValue = null) => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error getting localStorage item:', error);
      return defaultValue;
    }
  },

  // Remove item from localStorage
  removeItem: (key) => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing localStorage item:', error);
    }
  },

  // Clear all localStorage
  clear: () => {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  // Check if key exists
  hasItem: (key) => {
    try {
      return window.localStorage.getItem(key) !== null;
    } catch (error) {
      console.error('Error checking localStorage item:', error);
      return false;
    }
  },

  // Get all keys
  keys: () => {
    try {
      return Object.keys(window.localStorage);
    } catch (error) {
      console.error('Error getting localStorage keys:', error);
      return [];
    }
  },

  // Get storage size in bytes
  size: () => {
    try {
      let total = 0;
      for (let key in window.localStorage) {
        if (window.localStorage.hasOwnProperty(key)) {
          total += window.localStorage[key].length + key.length;
        }
      }
      return total;
    } catch (error) {
      console.error('Error calculating localStorage size:', error);
      return 0;
    }
  }
};

// Session Storage utilities
export const sessionStorage = {
  // Set item in sessionStorage
  setItem: (key, value) => {
    try {
      const serializedValue = JSON.stringify(value);
      window.sessionStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error setting sessionStorage item:', error);
    }
  },

  // Get item from sessionStorage
  getItem: (key, defaultValue = null) => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error getting sessionStorage item:', error);
      return defaultValue;
    }
  },

  // Remove item from sessionStorage
  removeItem: (key) => {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing sessionStorage item:', error);
    }
  },

  // Clear all sessionStorage
  clear: () => {
    try {
      window.sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
  },

  // Check if key exists
  hasItem: (key) => {
    try {
      return window.sessionStorage.getItem(key) !== null;
    } catch (error) {
      console.error('Error checking sessionStorage item:', error);
      return false;
    }
  }
};

// Enhanced storage with expiration
export const storage = {
  // Set item with optional expiration
  set: (key, value, expirationHours = null) => {
    try {
      const item = {
        value,
        timestamp: Date.now(),
        expiration: expirationHours ? Date.now() + (expirationHours * 60 * 60 * 1000) : null
      };
      localStorage.setItem(key, item);
    } catch (error) {
      console.error('Error setting storage item:', error);
    }
  },

  // Get item with expiration check
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;

      // Check if item has expired
      if (item.expiration && Date.now() > item.expiration) {
        localStorage.removeItem(key);
        return defaultValue;
      }

      return item.value;
    } catch (error) {
      console.error('Error getting storage item:', error);
      return defaultValue;
    }
  },

  // Remove item
  remove: (key) => {
    localStorage.removeItem(key);
  },

  // Clear all storage
  clear: () => {
    localStorage.clear();
  },

  // Clean expired items
  cleanExpired: () => {
    try {
      const keys = localStorage.keys();
      keys.forEach(key => {
        const item = localStorage.getItem(key);
        if (item && item.expiration && Date.now() > item.expiration) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error cleaning expired items:', error);
    }
  }
};

// Cookie utilities
export const cookies = {
  // Set cookie
  set: (name, value, days = 7, path = '/') => {
    try {
      let expires = '';
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `; expires=${date.toUTCString()}`;
      }
      document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}${expires}; path=${path}`;
    } catch (error) {
      console.error('Error setting cookie:', error);
    }
  },

  // Get cookie
  get: (name, defaultValue = null) => {
    try {
      const nameEQ = name + '=';
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
          const value = c.substring(nameEQ.length, c.length);
          return JSON.parse(decodeURIComponent(value));
        }
      }
      return defaultValue;
    } catch (error) {
      console.error('Error getting cookie:', error);
      return defaultValue;
    }
  },

  // Remove cookie
  remove: (name, path = '/') => {
    try {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
    } catch (error) {
      console.error('Error removing cookie:', error);
    }
  },

  // Check if cookie exists
  exists: (name) => {
    return document.cookie.split(';').some(cookie => 
      cookie.trim().startsWith(name + '=')
    );
  }
};

// Cache utilities with size limit
export const cache = {
  maxSize: 50, // Maximum number of items to cache
  prefix: 'app_cache_',

  // Set cache item
  set: (key, value, ttl = 3600000) => { // Default 1 hour TTL
    try {
      const cacheKey = `${cache.prefix}${key}`;
      const item = {
        value,
        timestamp: Date.now(),
        ttl: ttl
      };
      
      localStorage.setItem(cacheKey, item);
      cache._cleanup();
    } catch (error) {
      console.error('Error setting cache item:', error);
    }
  },

  // Get cache item
  get: (key, defaultValue = null) => {
    try {
      const cacheKey = `${cache.prefix}${key}`;
      const item = localStorage.getItem(cacheKey);
      
      if (!item) return defaultValue;

      // Check if item has expired
      if (Date.now() - item.timestamp > item.ttl) {
        localStorage.removeItem(cacheKey);
        return defaultValue;
      }

      return item.value;
    } catch (error) {
      console.error('Error getting cache item:', error);
      return defaultValue;
    }
  },

  // Remove cache item
  remove: (key) => {
    const cacheKey = `${cache.prefix}${key}`;
    localStorage.removeItem(cacheKey);
  },

  // Clear all cache
  clear: () => {
    const keys = localStorage.keys();
    keys.forEach(key => {
      if (key.startsWith(cache.prefix)) {
        localStorage.removeItem(key);
      }
    });
  },

  // Cleanup expired and excess items
  _cleanup: () => {
    try {
      const keys = localStorage.keys().filter(key => key.startsWith(cache.prefix));
      
      // Remove expired items
      keys.forEach(key => {
        const item = localStorage.getItem(key);
        if (item && Date.now() - item.timestamp > item.ttl) {
          localStorage.removeItem(key);
        }
      });

      // Remove excess items (keep most recent)
      const validKeys = localStorage.keys().filter(key => key.startsWith(cache.prefix));
      if (validKeys.length > cache.maxSize) {
        const items = validKeys.map(key => ({
          key,
          timestamp: localStorage.getItem(key)?.timestamp || 0
        }));
        
        items.sort((a, b) => b.timestamp - a.timestamp);
        
        // Remove oldest items
        for (let i = cache.maxSize; i < items.length; i++) {
          localStorage.removeItem(items[i].key);
        }
      }
    } catch (error) {
      console.error('Error cleaning up cache:', error);
    }
  }
};

// User preferences storage
export const preferences = {
  key: 'user_preferences',

  // Get all preferences
  get: () => {
    return storage.get(preferences.key, {
      theme: 'dark',
      language: 'en',
      autoplay: true,
      notifications: true,
      quality: 'auto',
      volume: 0.8
    });
  },

  // Set preference
  set: (key, value) => {
    const current = preferences.get();
    current[key] = value;
    storage.set(preferences.key, current);
  },

  // Get specific preference
  getValue: (key, defaultValue = null) => {
    const prefs = preferences.get();
    return prefs[key] !== undefined ? prefs[key] : defaultValue;
  },

  // Reset to defaults
  reset: () => {
    storage.remove(preferences.key);
  }
};

// Search history storage
export const searchHistory = {
  key: 'search_history',
  maxItems: 20,

  // Add search term
  add: (term) => {
    if (!term || term.trim() === '') return;
    
    const history = searchHistory.get();
    const cleanTerm = term.trim().toLowerCase();
    
    // Remove if already exists
    const filtered = history.filter(item => item.toLowerCase() !== cleanTerm);
    
    // Add to beginning
    filtered.unshift(term.trim());
    
    // Keep only max items
    const limited = filtered.slice(0, searchHistory.maxItems);
    
    storage.set(searchHistory.key, limited);
  },

  // Get search history
  get: () => {
    return storage.get(searchHistory.key, []);
  },

  // Remove search term
  remove: (term) => {
    const history = searchHistory.get();
    const filtered = history.filter(item => item.toLowerCase() !== term.toLowerCase());
    storage.set(searchHistory.key, filtered);
  },

  // Clear all history
  clear: () => {
    storage.remove(searchHistory.key);
  }
};

// Viewed content tracking
export const viewedContent = {
  key: 'viewed_content',
  maxItems: 100,

  // Add viewed content
  add: (contentId, title, thumbnail) => {
    const viewed = viewedContent.get();
    
    // Remove if already exists
    const filtered = viewed.filter(item => item.id !== contentId);
    
    // Add to beginning
    filtered.unshift({
      id: contentId,
      title,
      thumbnail,
      viewedAt: Date.now()
    });
    
    // Keep only max items
    const limited = filtered.slice(0, viewedContent.maxItems);
    
    storage.set(viewedContent.key, limited);
  },

  // Get viewed content
  get: () => {
    return storage.get(viewedContent.key, []);
  },

  // Remove viewed content
  remove: (contentId) => {
    const viewed = viewedContent.get();
    const filtered = viewed.filter(item => item.id !== contentId);
    storage.set(viewedContent.key, filtered);
  },

  // Clear all viewed content
  clear: () => {
    storage.remove(viewedContent.key);
  }
};

// Storage quota management
export const quota = {
  // Check available storage space
  check: () => {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        return navigator.storage.estimate();
      }
      
      // Fallback for browsers that don't support the Storage API
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      
      return Promise.resolve({
        quota: 5 * 1024 * 1024, // Assume 5MB quota
        usage: localStorage.size()
      });
    } catch (error) {
      console.error('Error checking storage quota:', error);
      return Promise.resolve({ quota: 0, usage: 0 });
    }
  },

  // Get usage percentage
  getUsagePercentage: async () => {
    try {
      const estimate = await quota.check();
      return estimate.quota > 0 ? (estimate.usage / estimate.quota) * 100 : 0;
    } catch (error) {
      console.error('Error getting usage percentage:', error);
      return 0;
    }
  },

  // Check if storage is nearly full
  isNearlyFull: async (threshold = 80) => {
    try {
      const percentage = await quota.getUsagePercentage();
      return percentage > threshold;
    } catch (error) {
      console.error('Error checking if storage is nearly full:', error);
      return false;
    }
  }
};

// Initialize storage cleanup on app start
export const initializeStorage = () => {
  try {
    // Clean expired items
    storage.cleanExpired();
    
    // Clean cache
    cache._cleanup();
    
    // Check storage quota and warn if nearly full
    quota.isNearlyFull().then(nearlyFull => {
      if (nearlyFull) {
        console.warn('Storage is nearly full. Consider clearing some data.');
      }
    });
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};