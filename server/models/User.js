const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true,
    trim: true,
    maxlength: [50, 'Username cannot be more than 50 characters'],
    minlength: [3, 'Username must be at least 3 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  passwordHash: {
    type: String,
    required: function() {
      return !this.googleId && !this.twitterId;
    },
    minlength: 6
  },
  role: {
    type: String,
    enum: ['viewer', 'creator', 'admin'],
    default: 'viewer'
  },
  ageVerified: {
    type: Boolean,
    default: false,
    required: true
  },
  profile: {
    firstName: String,
    lastName: String,
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot be more than 500 characters']
    },
    avatar: {
      type: String,
      default: 'https://res.cloudinary.com/default/image/upload/v1/default-avatar.png'
    },
    coverImage: String,
    dateOfBirth: Date,
    country: String,
    website: String,
    socialLinks: {
      twitter: String,
      instagram: String,
      onlyfans: String
    }
  },
  subscriptions: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Subscription'
  }],
  subscribers: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    subscribedAt: {
      type: Date,
      default: Date.now
    }
  }],
  following: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    followedAt: {
      type: Date,
      default: Date.now
    }
  }],
  favorites: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Media'
  }],
  watchHistory: [{
    media: {
      type: mongoose.Schema.ObjectId,
      ref: 'Media'
    },
    watchedAt: {
      type: Date,
      default: Date.now
    },
    watchTime: {
      type: Number,
      default: 0
    }
  }],
  earnings: {
    total: {
      type: Number,
      default: 0
    },
    pending: {
      type: Number,
      default: 0
    },
    paid: {
      type: Number,
      default: 0
    }
  },
  stripeCustomerId: String,
  stripeAccountId: String,
  googleId: String,
  twitterId: String,
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isSuspended: {
    type: Boolean,
    default: false
  },
  suspensionReason: String,
  lastLogin: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  emailVerificationExpire: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Virtual for subscriber count
UserSchema.virtual('subscriberCount').get(function() {
  return this.subscribers.length;
});

// Virtual for following count
UserSchema.virtual('followingCount').get(function() {
  return this.following.length;
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

// Remove sensitive data when converting to JSON
UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.passwordHash;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpire;
  delete userObject.emailVerificationToken;
  delete userObject.emailVerificationExpire;
  return userObject;
};

module.exports = mongoose.model('User', UserSchema);