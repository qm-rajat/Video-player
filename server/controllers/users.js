const { validationResult } = require('express-validator');
const User = require('../models/User');
const Media = require('../models/Media');
const { asyncHandler } = require('../middleware/asyncHandler');
const { logger } = require('../utils/logger');

// @desc    Get all users with filtering
// @route   GET /api/users
// @access  Private
exports.getUsers = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  // Build query
  let query = {};

  if (req.query.role) {
    query.role = req.query.role;
  }

  if (req.query.search) {
    query.$or = [
      { username: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  const users = await User.find(query)
    .select('-passwordHash -resetPasswordToken -emailVerificationToken')
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    count: users.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: users
  });
});

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-passwordHash -resetPasswordToken -emailVerificationToken')
    .populate('subscribers.user', 'username profile.avatar')
    .populate('following.user', 'username profile.avatar');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Get user's public content count
  const contentCount = await Media.countDocuments({
    creator: user._id,
    isActive: true,
    moderationStatus: 'approved'
  });

  const userData = user.toObject();
  userData.contentCount = contentCount;

  res.status(200).json({
    success: true,
    data: userData
  });
});

// @desc    Follow a user
// @route   POST /api/users/:id/follow
// @access  Private
exports.followUser = asyncHandler(async (req, res) => {
  const userToFollow = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user.id);

  if (!userToFollow) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  if (userToFollow._id.toString() === req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'You cannot follow yourself'
    });
  }

  // Check if already following
  const alreadyFollowing = currentUser.following.some(
    follow => follow.user.toString() === req.params.id
  );

  if (alreadyFollowing) {
    return res.status(400).json({
      success: false,
      message: 'You are already following this user'
    });
  }

  // Add to following list
  currentUser.following.push({
    user: userToFollow._id,
    followedAt: new Date()
  });

  // Add to followers list
  userToFollow.subscribers.push({
    user: currentUser._id,
    subscribedAt: new Date()
  });

  await Promise.all([currentUser.save(), userToFollow.save()]);

  logger.info(`User ${req.user.id} followed user ${req.params.id}`);

  res.status(200).json({
    success: true,
    message: 'User followed successfully'
  });
});

// @desc    Unfollow a user
// @route   DELETE /api/users/:id/follow
// @access  Private
exports.unfollowUser = asyncHandler(async (req, res) => {
  const userToUnfollow = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user.id);

  if (!userToUnfollow) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Remove from following list
  currentUser.following = currentUser.following.filter(
    follow => follow.user.toString() !== req.params.id
  );

  // Remove from followers list
  userToUnfollow.subscribers = userToUnfollow.subscribers.filter(
    subscriber => subscriber.user.toString() !== req.user.id
  );

  await Promise.all([currentUser.save(), userToUnfollow.save()]);

  logger.info(`User ${req.user.id} unfollowed user ${req.params.id}`);

  res.status(200).json({
    success: true,
    message: 'User unfollowed successfully'
  });
});

// @desc    Get user's followers
// @route   GET /api/users/:id/followers
// @access  Private
exports.getUserFollowers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  const user = await User.findById(req.params.id)
    .populate({
      path: 'subscribers.user',
      select: 'username profile.avatar isVerified',
      options: {
        skip: startIndex,
        limit: limit
      }
    });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const followers = user.subscribers.slice(startIndex, startIndex + limit);
  const total = user.subscribers.length;

  res.status(200).json({
    success: true,
    count: followers.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: followers
  });
});

// @desc    Get user's following
// @route   GET /api/users/:id/following
// @access  Private
exports.getUserFollowing = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  const user = await User.findById(req.params.id)
    .populate({
      path: 'following.user',
      select: 'username profile.avatar isVerified',
      options: {
        skip: startIndex,
        limit: limit
      }
    });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const following = user.following.slice(startIndex, startIndex + limit);
  const total = user.following.length;

  res.status(200).json({
    success: true,
    count: following.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: following
  });
});

// @desc    Get user's favorites
// @route   GET /api/users/me/favorites
// @access  Private
exports.getUserFavorites = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  const user = await User.findById(req.user.id)
    .populate({
      path: 'favorites',
      populate: {
        path: 'creator',
        select: 'username profile.avatar isVerified'
      },
      options: {
        skip: startIndex,
        limit: limit,
        sort: { createdAt: -1 }
      }
    });

  const favorites = user.favorites.slice(startIndex, startIndex + limit);
  const total = user.favorites.length;

  res.status(200).json({
    success: true,
    count: favorites.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: favorites
  });
});

// @desc    Get user's watch history
// @route   GET /api/users/me/history
// @access  Private
exports.getUserWatchHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  const user = await User.findById(req.user.id)
    .populate({
      path: 'watchHistory.media',
      populate: {
        path: 'creator',
        select: 'username profile.avatar isVerified'
      }
    });

  // Sort by watch date and paginate
  const sortedHistory = user.watchHistory
    .sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt))
    .slice(startIndex, startIndex + limit);

  const total = user.watchHistory.length;

  res.status(200).json({
    success: true,
    count: sortedHistory.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: sortedHistory
  });
});

// @desc    Clear user's watch history
// @route   DELETE /api/users/me/history
// @access  Private
exports.clearWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  user.watchHistory = [];
  await user.save();

  logger.info(`Watch history cleared for user ${req.user.id}`);

  res.status(200).json({
    success: true,
    message: 'Watch history cleared successfully'
  });
});