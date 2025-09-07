const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  media: {
    type: mongoose.Schema.ObjectId,
    ref: 'Media',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  parentComment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Comment',
    default: null
  },
  replies: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Comment'
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
        'spam',
        'harassment',
        'inappropriate',
        'hate-speech',
        'threats',
        'other'
      ]
    },
    description: String,
    reportedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isApproved: {
    type: Boolean,
    default: true
  },
  moderationNotes: String,
  isEdited: {
    type: Boolean,
    default: false
  },
  editHistory: [{
    content: String,
    editedAt: {
      type: Date,
      default: Date.now
    }
  }],
  mentions: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  timestamp: {
    type: Number, // Video timestamp if applicable
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for like count
CommentSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for dislike count
CommentSchema.virtual('dislikeCount').get(function() {
  return this.dislikes.length;
});

// Virtual for reply count
CommentSchema.virtual('replyCount').get(function() {
  return this.replies.length;
});

// Index for efficient queries
CommentSchema.index({ media: 1, createdAt: -1 });
CommentSchema.index({ user: 1, createdAt: -1 });
CommentSchema.index({ parentComment: 1, createdAt: 1 });

// Middleware to handle reply relationships
CommentSchema.pre('save', async function(next) {
  if (this.isNew && this.parentComment) {
    // Add this comment to parent's replies array
    await this.constructor.findByIdAndUpdate(
      this.parentComment,
      { $push: { replies: this._id } }
    );
  }
  next();
});

// Middleware to handle comment deletion
CommentSchema.pre('deleteOne', { document: true }, async function(next) {
  // Remove this comment from parent's replies array
  if (this.parentComment) {
    await this.constructor.findByIdAndUpdate(
      this.parentComment,
      { $pull: { replies: this._id } }
    );
  }
  
  // Delete all replies to this comment
  await this.constructor.deleteMany({ parentComment: this._id });
  
  next();
});

module.exports = mongoose.model('Comment', CommentSchema);