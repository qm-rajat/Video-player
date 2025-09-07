const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler } = require('./asyncHandler');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    const user = await User.findById(decoded.id).select('-passwordHash');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No user found with this token'
      });
    }

    if (user.isSuspended) {
      return res.status(401).json({
        success: false,
        message: 'Account is suspended'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Age verification middleware
exports.requireAgeVerification = (req, res, next) => {
  if (!req.user.ageVerified) {
    return res.status(403).json({
      success: false,
      message: 'Age verification required to access this content'
    });
  }
  next();
};

// Check if user owns resource
exports.checkOwnership = (Model, resourceParam = 'id') => {
  return asyncHandler(async (req, res, next) => {
    const resource = await Model.findById(req.params[resourceParam]);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    // Check if user owns the resource or is admin
    if (resource.creator && resource.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource'
      });
    }

    if (resource.user && resource.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource'
      });
    }

    req.resource = resource;
    next();
  });
};

// Check subscription access
exports.checkSubscriptionAccess = asyncHandler(async (req, res, next) => {
  const media = req.resource || await Media.findById(req.params.id);
  
  if (!media) {
    return res.status(404).json({
      success: false,
      message: 'Media not found'
    });
  }

  // If media is free or user is the creator, allow access
  if (!media.isPremium || media.creator.toString() === req.user.id) {
    return next();
  }

  // Check if user has active subscription to creator
  const Subscription = require('../models/Subscription');
  const subscription = await Subscription.findOne({
    subscriber: req.user.id,
    creator: media.creator,
    paymentStatus: 'active',
    endDate: { $gt: new Date() }
  });

  if (!subscription) {
    return res.status(403).json({
      success: false,
      message: 'Active subscription required to access this premium content'
    });
  }

  // Check subscription tier access
  const tierLevels = { basic: 1, premium: 2, vip: 3 };
  const requiredLevel = tierLevels[media.subscriptionTier] || 1;
  const userLevel = tierLevels[subscription.tier] || 1;

  if (userLevel < requiredLevel) {
    return res.status(403).json({
      success: false,
      message: `${media.subscriptionTier} subscription tier required to access this content`
    });
  }

  next();
});