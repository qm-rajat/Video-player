const { validationResult } = require('express-validator');
const User = require('../models/User');
const Media = require('../models/Media');
const Comment = require('../models/Comment');
const Subscription = require('../models/Subscription');
const { asyncHandler } = require('../middleware/asyncHandler');
const { logger } = require('../utils/logger');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
exports.getDashboardStats = asyncHandler(async (req, res) => {
  // Get date ranges
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Get user statistics
  const totalUsers = await User.countDocuments();
  const newUsersThisMonth = await User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo }
  });
  const activeUsers = await User.countDocuments({ isActive: true });
  const suspendedUsers = await User.countDocuments({ isSuspended: true });

  // Get creator statistics
  const totalCreators = await User.countDocuments({ role: 'creator' });
  const verifiedCreators = await User.countDocuments({ 
    role: 'creator', 
    isVerified: true 
  });

  // Get content statistics
  const totalMedia = await Media.countDocuments();
  const pendingMedia = await Media.countDocuments({ 
    moderationStatus: 'pending' 
  });
  const approvedMedia = await Media.countDocuments({ 
    moderationStatus: 'approved' 
  });
  const flaggedMedia = await Media.countDocuments({ isFlagged: true });
  const newMediaThisWeek = await Media.countDocuments({
    createdAt: { $gte: sevenDaysAgo }
  });

  // Get subscription statistics
  const activeSubscriptions = await Subscription.countDocuments({
    paymentStatus: 'active'
  });
  const totalRevenue = await Subscription.aggregate([
    { $match: { paymentStatus: 'active' } },
    { $group: { _id: null, total: { $sum: '$price' } } }
  ]);

  // Get recent activity
  const recentUsers = await User.find()
    .select('username email role createdAt')
    .sort({ createdAt: -1 })
    .limit(5);

  const recentMedia = await Media.find()
    .populate('creator', 'username')
    .select('title creator createdAt moderationStatus')
    .sort({ createdAt: -1 })
    .limit(5);

  const stats = {
    users: {
      total: totalUsers,
      active: activeUsers,
      suspended: suspendedUsers,
      newThisMonth: newUsersThisMonth,
      creators: {
        total: totalCreators,
        verified: verifiedCreators
      }
    },
    content: {
      total: totalMedia,
      pending: pendingMedia,
      approved: approvedMedia,
      flagged: flaggedMedia,
      newThisWeek: newMediaThisWeek
    },
    revenue: {
      activeSubscriptions,
      totalRevenue: totalRevenue[0]?.total || 0
    },
    recent: {
      users: recentUsers,
      media: recentMedia
    }
  };

  res.status(200).json({
    success: true,
    data: stats
  });
});

// @desc    Get reported content
// @route   GET /api/admin/reports
// @access  Private (Admin only)
exports.getReportedContent = asyncHandler(async (req, res) => {
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
  let query = { isFlagged: true };

  if (req.query.type) {
    // This would be enhanced to support different content types
    query.mediaType = req.query.type;
  }

  if (req.query.status) {
    query.moderationStatus = req.query.status;
  }

  const reportedContent = await Media.find(query)
    .populate('creator', 'username profile.avatar')
    .populate('flagReports.reporter', 'username')
    .sort({ 'flagReports.reportedAt': -1 })
    .skip(startIndex)
    .limit(limit);

  const total = await Media.countDocuments(query);

  res.status(200).json({
    success: true,
    count: reportedContent.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: reportedContent
  });
});

// @desc    Moderate content
// @route   PUT /api/admin/moderate/:type/:id
// @access  Private (Admin only)
exports.moderateContent = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { type, id } = req.params;
  const { action, notes } = req.body;

  let content;
  
  if (type === 'media') {
    content = await Media.findById(id);
  } else if (type === 'comment') {
    content = await Comment.findById(id);
  } else {
    return res.status(400).json({
      success: false,
      message: 'Invalid content type'
    });
  }

  if (!content) {
    return res.status(404).json({
      success: false,
      message: 'Content not found'
    });
  }

  // Apply moderation action
  switch (action) {
    case 'approve':
      content.moderationStatus = 'approved';
      content.isFlagged = false;
      content.isActive = true;
      break;
    case 'reject':
      content.moderationStatus = 'rejected';
      content.isActive = false;
      break;
    case 'remove':
      content.isActive = false;
      content.moderationStatus = 'removed';
      break;
    default:
      return res.status(400).json({
        success: false,
        message: 'Invalid moderation action'
      });
  }

  content.moderationNotes = notes;
  await content.save();

  logger.info(`Content moderated by admin ${req.user.id}: ${type}/${id} - ${action}`);

  res.status(200).json({
    success: true,
    message: `Content ${action}ed successfully`,
    data: content
  });
});

// @desc    Get users for admin management
// @route   GET /api/admin/users
// @access  Private (Admin only)
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

  if (req.query.status) {
    switch (req.query.status) {
      case 'active':
        query.isActive = true;
        query.isSuspended = false;
        break;
      case 'suspended':
        query.isSuspended = true;
        break;
      case 'inactive':
        query.isActive = false;
        break;
    }
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

// @desc    Suspend user
// @route   PUT /api/admin/users/:id/suspend
// @access  Private (Admin only)
exports.suspendUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  if (user.role === 'admin') {
    return res.status(400).json({
      success: false,
      message: 'Cannot suspend admin users'
    });
  }

  user.isSuspended = true;
  user.suspensionReason = req.body.reason;
  
  if (req.body.duration) {
    const suspensionEnd = new Date();
    suspensionEnd.setDate(suspensionEnd.getDate() + parseInt(req.body.duration));
    user.suspensionEnd = suspensionEnd;
  }

  await user.save();

  logger.info(`User suspended by admin ${req.user.id}: ${user.username} - ${req.body.reason}`);

  res.status(200).json({
    success: true,
    message: 'User suspended successfully',
    data: user
  });
});

// @desc    Unsuspend user
// @route   PUT /api/admin/users/:id/unsuspend
// @access  Private (Admin only)
exports.unsuspendUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  user.isSuspended = false;
  user.suspensionReason = undefined;
  user.suspensionEnd = undefined;
  await user.save();

  logger.info(`User unsuspended by admin ${req.user.id}: ${user.username}`);

  res.status(200).json({
    success: true,
    message: 'User unsuspended successfully',
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  if (user.role === 'admin') {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete admin users'
    });
  }

  // Delete user's content
  await Media.deleteMany({ creator: user._id });
  await Comment.deleteMany({ user: user._id });
  await Subscription.deleteMany({ 
    $or: [{ subscriber: user._id }, { creator: user._id }]
  });

  // Delete user
  await user.deleteOne();

  logger.info(`User deleted by admin ${req.user.id}: ${user.username}`);

  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

// @desc    Get payment statistics
// @route   GET /api/admin/payments
// @access  Private (Admin only)
exports.getPaymentStats = asyncHandler(async (req, res) => {
  // Get subscription statistics
  const subscriptionStats = await Subscription.aggregate([
    {
      $group: {
        _id: '$tier',
        count: { $sum: 1 },
        revenue: { $sum: '$price' }
      }
    }
  ]);

  const totalRevenue = await Subscription.aggregate([
    { $match: { paymentStatus: 'active' } },
    { $group: { _id: null, total: { $sum: '$price' } } }
  ]);

  const monthlyRevenue = await Subscription.aggregate([
    {
      $match: {
        paymentStatus: 'active',
        createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
      }
    },
    { $group: { _id: null, total: { $sum: '$price' } } }
  ]);

  const stats = {
    subscriptions: subscriptionStats,
    totalRevenue: totalRevenue[0]?.total || 0,
    monthlyRevenue: monthlyRevenue[0]?.total || 0,
    activeSubscriptions: await Subscription.countDocuments({ paymentStatus: 'active' }),
    cancelledSubscriptions: await Subscription.countDocuments({ paymentStatus: 'cancelled' })
  };

  res.status(200).json({
    success: true,
    data: stats
  });
});

// @desc    Get system logs
// @route   GET /api/admin/logs
// @access  Private (Admin only)
exports.getSystemLogs = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  // This would typically read from log files or a logging service
  // For now, return a placeholder response
  const logs = [
    {
      timestamp: new Date(),
      level: 'info',
      message: 'System logs would be displayed here',
      service: 'api'
    }
  ];

  res.status(200).json({
    success: true,
    data: logs
  });
});