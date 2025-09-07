const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot be more than 30 characters']
  }],
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'amateur',
      'professional',
      'couples',
      'solo-female',
      'solo-male',
      'group',
      'fetish',
      'bdsm',
      'roleplay',
      'vintage',
      'other'
    ]
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  mediaType: {
    type: String,
    enum: ['video', 'image', 'gif'],
    required: true
  },
  mediaUrl: {
    type: String,
    required: [true, 'Media URL is required']
  },
  thumbnailUrl: {
    type: String,
    required: [true, 'Thumbnail URL is required']
  },
  previewUrl: String, // For video previews
  duration: {
    type: Number, // in seconds
    required: function() {
      return this.mediaType === 'video';
    }
  },
  resolution: {
    width: Number,
    height: Number
  },
  fileSize: Number, // in bytes
  cloudinaryPublicId: String,
  views: {
    type: Number,
    default: 0
  },
  uniqueViews: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    },
    ipAddress: String
  }],
  likes: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  dislikes: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    dislikedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Comment'
  }],
  shares: {
    type: Number,
    default: 0
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  subscriptionTier: {
    type: String,
    enum: ['free', 'basic', 'premium', 'vip'],
    default: 'free'
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  isFlagged: {
    type: Boolean,
    default: false
  },
  flagReports: [{
    reporter: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      enum: [
        'inappropriate-content',
        'copyright-violation',
        'spam',
        'harassment',
        'underage',
        'non-consensual',
        'violence',
        'other'
      ]
    },
    description: String,
    reportedAt: {
      type: Date,
      default: Date.now
    }
  }],
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'under-review'],
    default: 'pending'
  },
  moderationNotes: String,
  isActive: {
    type: Boolean,
    default: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  scheduledPublishAt: Date,
  analytics: {
    totalWatchTime: {
      type: Number,
      default: 0
    },
    averageWatchTime: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    },
    engagement: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for like count
MediaSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for dislike count
MediaSchema.virtual('dislikeCount').get(function() {
  return this.dislikes.length;
});

// Virtual for comment count
MediaSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Virtual for unique view count
MediaSchema.virtual('uniqueViewCount').get(function() {
  return this.uniqueViews.length;
});

// Index for search optimization
MediaSchema.index({ title: 'text', description: 'text', tags: 'text' });
MediaSchema.index({ creator: 1, createdAt: -1 });
MediaSchema.index({ category: 1, createdAt: -1 });
MediaSchema.index({ views: -1, createdAt: -1 });
MediaSchema.index({ 'likes.likedAt': -1 });

// Middleware to update analytics
MediaSchema.pre('save', function(next) {
  if (this.isModified('uniqueViews')) {
    this.views = this.uniqueViews.length;
  }
  
  if (this.likes.length > 0 || this.dislikes.length > 0) {
    const totalInteractions = this.likes.length + this.dislikes.length + this.comments.length;
    this.analytics.engagement = this.uniqueViews.length > 0 ? 
      (totalInteractions / this.uniqueViews.length) * 100 : 0;
  }
  
  next();
});

module.exports = mongoose.model('Media', MediaSchema);