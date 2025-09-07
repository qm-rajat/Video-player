// Media utility functions for handling video, image, and audio operations

// Video utilities
export const videoUtils = {
  // Get video duration from file
  getDuration: (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      
      video.onerror = () => {
        reject(new Error('Failed to load video metadata'));
      };
      
      video.src = URL.createObjectURL(file);
    });
  },

  // Get video dimensions
  getDimensions: (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve({
          width: video.videoWidth,
          height: video.videoHeight
        });
      };
      
      video.onerror = () => {
        reject(new Error('Failed to load video metadata'));
      };
      
      video.src = URL.createObjectURL(file);
    });
  },

  // Generate video thumbnail
  generateThumbnail: (file, time = 0) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      video.onloadeddata = () => {
        video.currentTime = time;
      };
      
      video.onseeked = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          window.URL.revokeObjectURL(video.src);
          resolve(blob);
        }, 'image/jpeg', 0.8);
      };
      
      video.onerror = () => {
        reject(new Error('Failed to generate thumbnail'));
      };
      
      video.src = URL.createObjectURL(file);
    });
  },

  // Check if video format is supported
  isSupported: (mimeType) => {
    const video = document.createElement('video');
    return video.canPlayType(mimeType) !== '';
  },

  // Format video duration for display
  formatDuration: (seconds) => {
    if (!seconds || seconds < 0) return '0:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  },

  // Parse duration string to seconds
  parseDuration: (durationString) => {
    const parts = durationString.split(':').map(Number);
    
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else {
      return parts[0] || 0;
    }
  }
};

// Image utilities
export const imageUtils = {
  // Get image dimensions
  getDimensions: (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        window.URL.revokeObjectURL(img.src);
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = URL.createObjectURL(file);
    });
  },

  // Resize image
  resize: (file, maxWidth, maxHeight, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        const { width, height } = img;
        
        // Calculate new dimensions
        let newWidth = width;
        let newHeight = height;
        
        if (width > maxWidth) {
          newWidth = maxWidth;
          newHeight = (height * maxWidth) / width;
        }
        
        if (newHeight > maxHeight) {
          newHeight = maxHeight;
          newWidth = (newWidth * maxHeight) / newHeight;
        }
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        canvas.toBlob((blob) => {
          window.URL.revokeObjectURL(img.src);
          resolve(blob);
        }, file.type, quality);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to resize image'));
      };
      
      img.src = URL.createObjectURL(file);
    });
  },

  // Crop image
  crop: (file, x, y, width, height) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          window.URL.revokeObjectURL(img.src);
          resolve(blob);
        }, file.type, 0.8);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to crop image'));
      };
      
      img.src = URL.createObjectURL(file);
    });
  },

  // Convert image to different format
  convert: (file, newType, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          window.URL.revokeObjectURL(img.src);
          resolve(blob);
        }, newType, quality);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to convert image'));
      };
      
      img.src = URL.createObjectURL(file);
    });
  },

  // Generate image thumbnail
  generateThumbnail: (file, size = 200) => {
    return imageUtils.resize(file, size, size, 0.7);
  },

  // Check if image format is supported
  isSupported: (mimeType) => {
    const supportedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml'
    ];
    return supportedTypes.includes(mimeType);
  }
};

// File utilities
export const fileUtils = {
  // Get file extension
  getExtension: (filename) => {
    return filename.split('.').pop().toLowerCase();
  },

  // Get file type from extension
  getTypeFromExtension: (extension) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const videoExtensions = ['mp4', 'webm', 'ogg', 'avi', 'mov', 'wmv'];
    
    if (imageExtensions.includes(extension)) return 'image';
    if (videoExtensions.includes(extension)) return 'video';
    return 'unknown';
  },

  // Format file size
  formatSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Validate file type
  validateType: (file, allowedTypes) => {
    return allowedTypes.includes(file.type);
  },

  // Validate file size
  validateSize: (file, maxSize) => {
    return file.size <= maxSize;
  },

  // Read file as data URL
  readAsDataURL: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      reader.readAsDataURL(file);
    });
  },

  // Read file as text
  readAsText: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      reader.readAsText(file);
    });
  },

  // Read file as array buffer
  readAsArrayBuffer: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      reader.readAsArrayBuffer(file);
    });
  }
};

// Media player utilities
export const playerUtils = {
  // Create video element with custom settings
  createVideoElement: (src, options = {}) => {
    const video = document.createElement('video');
    
    video.src = src;
    video.controls = options.controls !== false;
    video.autoplay = options.autoplay || false;
    video.muted = options.muted || false;
    video.loop = options.loop || false;
    video.preload = options.preload || 'metadata';
    
    if (options.poster) {
      video.poster = options.poster;
    }
    
    return video;
  },

  // Get video quality levels
  getQualityLevels: (video) => {
    const levels = [];
    
    if (video.videoTracks) {
      for (let i = 0; i < video.videoTracks.length; i++) {
        const track = video.videoTracks[i];
        levels.push({
          id: track.id,
          label: track.label,
          width: track.sourceBuffer?.videoWidth,
          height: track.sourceBuffer?.videoHeight
        });
      }
    }
    
    return levels;
  },

  // Set video quality
  setQuality: (video, qualityId) => {
    if (video.videoTracks) {
      for (let i = 0; i < video.videoTracks.length; i++) {
        const track = video.videoTracks[i];
        track.selected = track.id === qualityId;
      }
    }
  },

  // Handle fullscreen
  toggleFullscreen: (element) => {
    if (!document.fullscreenElement) {
      element.requestFullscreen?.() ||
      element.webkitRequestFullscreen?.() ||
      element.msRequestFullscreen?.();
    } else {
      document.exitFullscreen?.() ||
      document.webkitExitFullscreen?.() ||
      document.msExitFullscreen?.();
    }
  },

  // Handle picture-in-picture
  togglePictureInPicture: async (video) => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch (error) {
      console.error('Picture-in-picture error:', error);
    }
  },

  // Get video stats
  getStats: (video) => {
    return {
      duration: video.duration,
      currentTime: video.currentTime,
      buffered: video.buffered,
      played: video.played,
      seekable: video.seekable,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
      readyState: video.readyState,
      networkState: video.networkState
    };
  }
};

// Stream utilities
export const streamUtils = {
  // Check if browser supports MediaRecorder
  isRecordingSupported: () => {
    return typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported;
  },

  // Get user media (camera/microphone)
  getUserMedia: async (constraints = { video: true, audio: true }) => {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (error) {
      console.error('Error accessing user media:', error);
      throw error;
    }
  },

  // Get screen capture
  getDisplayMedia: async (constraints = { video: true, audio: false }) => {
    try {
      return await navigator.mediaDevices.getDisplayMedia(constraints);
    } catch (error) {
      console.error('Error accessing display media:', error);
      throw error;
    }
  },

  // Create media recorder
  createRecorder: (stream, options = {}) => {
    const defaultOptions = {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 2500000, // 2.5 Mbps
      audioBitsPerSecond: 128000   // 128 kbps
    };
    
    return new MediaRecorder(stream, { ...defaultOptions, ...options });
  },

  // Stop all tracks in a stream
  stopStream: (stream) => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  }
};

// Compression utilities
export const compressionUtils = {
  // Compress image
  compressImage: async (file, quality = 0.8, maxWidth = 1920, maxHeight = 1080) => {
    try {
      const compressed = await imageUtils.resize(file, maxWidth, maxHeight, quality);
      return compressed;
    } catch (error) {
      console.error('Image compression error:', error);
      return file; // Return original if compression fails
    }
  },

  // Estimate compression ratio
  getCompressionRatio: (originalSize, compressedSize) => {
    return ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
  },

  // Progressive JPEG encoding
  createProgressiveJPEG: (file) => {
    return imageUtils.convert(file, 'image/jpeg', 0.85);
  }
};

// Media validation utilities
export const validationUtils = {
  // Validate video file
  validateVideo: async (file, constraints = {}) => {
    const errors = [];
    
    // Check file size
    if (constraints.maxSize && file.size > constraints.maxSize) {
      errors.push(`File size exceeds ${fileUtils.formatSize(constraints.maxSize)}`);
    }
    
    // Check file type
    if (constraints.allowedTypes && !constraints.allowedTypes.includes(file.type)) {
      errors.push('Invalid file type');
    }
    
    try {
      // Check duration
      if (constraints.maxDuration) {
        const duration = await videoUtils.getDuration(file);
        if (duration > constraints.maxDuration) {
          errors.push(`Duration exceeds ${videoUtils.formatDuration(constraints.maxDuration)}`);
        }
      }
      
      // Check dimensions
      if (constraints.maxWidth || constraints.maxHeight) {
        const { width, height } = await videoUtils.getDimensions(file);
        if (constraints.maxWidth && width > constraints.maxWidth) {
          errors.push(`Width exceeds ${constraints.maxWidth}px`);
        }
        if (constraints.maxHeight && height > constraints.maxHeight) {
          errors.push(`Height exceeds ${constraints.maxHeight}px`);
        }
      }
    } catch (error) {
      errors.push('Unable to read video metadata');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Validate image file
  validateImage: async (file, constraints = {}) => {
    const errors = [];
    
    // Check file size
    if (constraints.maxSize && file.size > constraints.maxSize) {
      errors.push(`File size exceeds ${fileUtils.formatSize(constraints.maxSize)}`);
    }
    
    // Check file type
    if (constraints.allowedTypes && !constraints.allowedTypes.includes(file.type)) {
      errors.push('Invalid file type');
    }
    
    try {
      // Check dimensions
      if (constraints.maxWidth || constraints.maxHeight || constraints.minWidth || constraints.minHeight) {
        const { width, height } = await imageUtils.getDimensions(file);
        
        if (constraints.maxWidth && width > constraints.maxWidth) {
          errors.push(`Width exceeds ${constraints.maxWidth}px`);
        }
        if (constraints.maxHeight && height > constraints.maxHeight) {
          errors.push(`Height exceeds ${constraints.maxHeight}px`);
        }
        if (constraints.minWidth && width < constraints.minWidth) {
          errors.push(`Width must be at least ${constraints.minWidth}px`);
        }
        if (constraints.minHeight && height < constraints.minHeight) {
          errors.push(`Height must be at least ${constraints.minHeight}px`);
        }
      }
    } catch (error) {
      errors.push('Unable to read image metadata');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

// Export all utilities
export {
  videoUtils,
  imageUtils,
  fileUtils,
  playerUtils,
  streamUtils,
  compressionUtils,
  validationUtils
};