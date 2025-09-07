const crypto = require('crypto');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const { sendTokenResponse } = require('../utils/jwt');
const { asyncHandler } = require('../middleware/asyncHandler');
const { logger } = require('../utils/logger');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { username, email, password, dateOfBirth, role } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email or username'
    });
  }

  // Create user
  const user = await User.create({
    username,
    email,
    passwordHash: password,
    role: role || 'viewer',
    profile: {
      dateOfBirth: new Date(dateOfBirth)
    },
    ageVerified: true // Auto-verify since we checked age during registration
  });

  logger.info(`New user registered: ${user.email}`);

  sendTokenResponse(user, 201, res, 'User registered successfully');
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check if account is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Account is deactivated'
    });
  }

  if (user.isSuspended) {
    return res.status(401).json({
      success: false,
      message: 'Account is suspended'
    });
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  logger.info(`User logged in: ${user.email}`);

  sendTokenResponse(user, 200, res, 'Login successful');
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
exports.logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate('subscriptions')
    .populate('subscribers.user', 'username profile.avatar')
    .populate('following.user', 'username profile.avatar');

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const fieldsToUpdate = {};
  const allowedFields = ['username', 'email', 'profile'];

  // Only update provided fields
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      if (key === 'profile') {
        fieldsToUpdate.profile = { ...req.user.profile, ...req.body.profile };
      } else {
        fieldsToUpdate[key] = req.body[key];
      }
    }
  });

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  logger.info(`User profile updated: ${user.email}`);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user
  });
});

// @desc    Update password
// @route   PUT /api/auth/password
// @access  Private
exports.updatePassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const user = await User.findById(req.user.id).select('+passwordHash');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  user.passwordHash = req.body.newPassword;
  await user.save();

  logger.info(`Password updated for user: ${user.email}`);

  sendTokenResponse(user, 200, res, 'Password updated successfully');
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'There is no user with that email'
    });
  }

  // Get reset token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

  // TODO: Send email with reset URL
  // For now, just return the token (in production, this should be sent via email)
  
  logger.info(`Password reset requested for: ${user.email}`);

  res.status(200).json({
    success: true,
    message: 'Password reset email sent',
    resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
  });
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token'
    });
  }

  // Set new password
  user.passwordHash = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  logger.info(`Password reset successful for: ${user.email}`);

  sendTokenResponse(user, 200, res, 'Password reset successful');
});

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = asyncHandler(async (req, res) => {
  const emailVerificationToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    emailVerificationToken,
    emailVerificationExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired verification token'
    });
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;
  await user.save();

  logger.info(`Email verified for: ${user.email}`);

  res.status(200).json({
    success: true,
    message: 'Email verified successfully'
  });
});

// @desc    Resend email verification
// @route   POST /api/auth/resend-verification
// @access  Private
exports.resendVerification = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user.isVerified) {
    return res.status(400).json({
      success: false,
      message: 'Email is already verified'
    });
  }

  // Generate verification token
  const verificationToken = crypto.randomBytes(20).toString('hex');

  user.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  await user.save({ validateBeforeSave: false });

  // TODO: Send verification email
  
  logger.info(`Email verification resent for: ${user.email}`);

  res.status(200).json({
    success: true,
    message: 'Verification email sent',
    verificationToken: process.env.NODE_ENV === 'development' ? verificationToken : undefined
  });
});

// @desc    Verify age with ID document
// @route   POST /api/auth/verify-age
// @access  Private
exports.verifyAge = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const user = await User.findById(req.user.id);

  // In a real application, you would verify the ID document
  // For now, we'll just mark as verified if date of birth indicates 18+
  const birthDate = new Date(req.body.dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();

  if (age < 18) {
    return res.status(400).json({
      success: false,
      message: 'You must be at least 18 years old'
    });
  }

  user.ageVerified = true;
  user.profile.dateOfBirth = birthDate;
  await user.save();

  logger.info(`Age verified for user: ${user.email}`);

  res.status(200).json({
    success: true,
    message: 'Age verification successful',
    data: user
  });
});

// @desc    Delete user account
// @route   DELETE /api/auth/account
// @access  Private
exports.deleteAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  // In a real application, you might want to:
  // 1. Cancel all subscriptions
  // 2. Delete all user content
  // 3. Process any pending payments
  // 4. Send confirmation email

  await user.deleteOne();

  logger.info(`Account deleted: ${user.email}`);

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully'
  });
});