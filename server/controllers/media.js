const { validationResult } = require('express-validator');
const cloudinary = require('cloudinary').v2;
const Media = require('../models/Media');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/asyncHandler');
const { logger } = require('../utils/logger');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// @desc    Get all media with filtering and pagination
// @route   GET /api/media
// @access  Private (Age verified)
exports.getMedia = asyncHandler(async (req, res) => {
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
  let query = Media.find({ 
    isActive: true, 
    moderationStatus: 'approved',
    $or: [
      { scheduledPublishAt: { $lte: new Date() } },
      { scheduledPublishAt: { $exists: false } }
    ]
  });

  // Filter by category
  if (req.query.category) {
    query = query.find({ category: req.query.category });
  }

  // Filter by subscription access
  if (!req.user || req.user.role === 'viewer') {
    query = query.find({
      $or: [
        { isPremium: false },
        { creator: req.user?.id }
      ]
    });
  }

  // Sort
  switch (req.query.sort) {
    case 'oldest':
      query = query.sort({ createdAt: 1 });
      break;
    case 'popular':
      query = query.sort({ views: -1, createdAt: -1 });
      break;
    case 'trending':
      // Trending based on recent engagement
      query = query.sort({ 
        'analytics.engagement': -1, 
        views: -1, 
        createdAt: -1 
      });
      break;
    case 'most-liked':
      query = query.sort({ 'likes.length': -1, createdAt: -1 });
      break;
    default:
      query = query.sort({ createdAt: -1 });
  }

  // Execute query
  const media = await query
    .skip(startIndex)
    .limit(limit)
    .populate('creator', 'username profile.avatar isVerified')
    .select('-uniqueViews -flagReports');

  const total = await Media.countDocuments(query.getQuery());

  res.status(200).json({
    success: true,
    count: media.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: media
  });
});

// @desc    Get single media by ID
// @route   GET /api/media/:id
// @access  Private (Age verified, subscription check)
exports.getMediaById = asyncHandler(async (req, res) => {
  const media = await Media.findById(req.params.id)
    .populate('creator', 'username profile isVerified subscriberCount')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'username profile.avatar'
      }
    });

  if (!media) {
    return res.status(404).json({
      success: false,
      message: 'Media not found'
    });
  }

  if (!media.isActive || media.moderationStatus !== 'approved') {
    return res.status(404).json({
      success: false,
      message: 'Media not found'
    });
  }

  // Check if scheduled content is ready
  if (media.scheduledPublishAt && media.scheduledPublishAt > new Date()) {
    if (media.creator._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(404).json({
        success: false,
        message: 'Media not found'
      });
    }
  }

  // Remove sensitive data
  const mediaData = media.toObject();
  delete mediaData.uniqueViews;
  delete mediaData.flagReports;

  res.status(200).json({
    success: true,
    data: mediaData
  });
});

// @desc    Upload new media
// @route   POST /api/media/upload
// @access  Private (Creator only)
exports.uploadMedia = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  if (!req.files || !req.files.media) {
    return res.status(400).json({
      success: false,
      message: 'Please upload a media file'
    });
  }

  const mediaFile = req.files.media[0];
  const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;

  try {
    // Upload media to Cloudinary
    const mediaUpload = await new Promise((resolve, reject) => {
      const uploadOptions = {
        folder: 'adult-content/media',
        resource_type: 'auto',
        quality: 'auto:good',
        format: 'auto'
      };

      if (mediaFile.mimetype.startsWith('video/')) {
        uploadOptions.video_codec = 'h264';
        uploadOptions.audio_codec = 'aac';
      }

      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(mediaFile.buffer);
    });

    // Upload or generate thumbnail
    let thumbnailUpload;
    if (thumbnailFile) {
      thumbnailUpload = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'adult-content/thumbnails',
            resource_type: 'image',
            quality: 'auto:good',
            format: 'auto',
            transformation: [
              { width: 640, height: 360, crop: 'fill' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(thumbnailFile.buffer);
      });
    } else if (mediaFile.mimetype.startsWith('video/')) {
      // Generate thumbnail from video
      thumbnailUpload = await cloudinary.uploader.upload(mediaUpload.secure_url, {
        folder: 'adult-content/thumbnails',
        resource_type: 'video',
        format: 'jpg',
        transformation: [
          { width: 640, height: 360, crop: 'fill' },
          { start_offset: '10%' }
        ]
      });
    } else {
      // Use the image itself as thumbnail
      thumbnailUpload = mediaUpload;
    }

    // Create media record
    const mediaData = {
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      category: req.body.category,
      creator: req.user.id,
      mediaType: mediaFile.mimetype.startsWith('video/') ? 'video' : 'image',
      mediaUrl: mediaUpload.secure_url,
      thumbnailUrl: thumbnailUpload.secure_url,
      cloudinaryPublicId: mediaUpload.public_id,
      duration: mediaUpload.duration,
      resolution: {
        width: mediaUpload.width,
        height: mediaUpload.height
      },
      fileSize: mediaUpload.bytes,
      isPremium: req.body.isPremium === 'true',
      subscriptionTier: req.body.subscriptionTier || 'free',
      price: parseFloat(req.body.price) || 0,
      scheduledPublishAt: req.body.scheduledPublishAt ? new Date(req.body.scheduledPublishAt) : undefined
    };

    const media = await Media.create(mediaData);

    logger.info(`Media uploaded by ${req.user.username}: ${media.title}`);

    res.status(201).json({
      success: true,
      message: 'Media uploaded successfully',
      data: media
    });

  } catch (error) {
    logger.error('Media upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading media'
    });
  }
});

// @desc    Update media
// @route   PUT /api/media/:id
// @access  Private (Owner only)
exports.updateMedia = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const media = req.resource; // From checkOwnership middleware

  const allowedFields = ['title', 'description', 'tags', 'isPremium', 'subscriptionTier', 'price'];
  const updates = {};

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const updatedMedia = await Media.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  ).populate('creator', 'username profile.avatar');

  logger.info(`Media updated: ${updatedMedia.title} by ${req.user.username}`);

  res.status(200).json({
    success: true,
    message: 'Media updated successfully',
    data: updatedMedia
  });
});

// @desc    Delete media
// @route   DELETE /api/media/:id
// @access  Private (Owner only)
exports.deleteMedia = asyncHandler(async (req, res) => {
  const media = req.resource; // From checkOwnership middleware

  // Delete from Cloudinary
  if (media.cloudinaryPublicId) {
    try {
      await cloudinary.uploader.destroy(media.cloudinaryPublicId, {
        resource_type: media.mediaType === 'video' ? 'video' : 'image'
      });
    } catch (error) {
      logger.error('Error deleting from Cloudinary:', error);
    }
  }

  // Delete comments
  await Comment.deleteMany({ media: media._id });

  // Delete media
  await media.deleteOne();

  logger.info(`Media deleted: ${media.title} by ${req.user.username}`);

  res.status(200).json({
    success: true,
    message: 'Media deleted successfully'
  });
});

// @desc    Like media
// @route   POST /api/media/:id/like
// @access  Private
exports.likeMedia = asyncHandler(async (req, res) => {
  const media = await Media.findById(req.params.id);

  if (!media) {
    return res.status(404).json({
      success: false,
      message: 'Media not found'
    });
  }

  // Check if already liked
  const alreadyLiked = media.likes.find(like => like.user.toString() === req.user.id);
  if (alreadyLiked) {
    return res.status(400).json({
      success: false,
      message: 'Media already liked'
    });
  }

  // Remove from dislikes if exists
  media.dislikes = media.dislikes.filter(dislike => dislike.user.toString() !== req.user.id);

  // Add to likes
  media.likes.push({ user: req.user.id });
  await media.save();

  res.status(200).json({
    success: true,
    message: 'Media liked successfully',
    likeCount: media.likes.length
  });
});

// @desc    Unlike media
// @route   DELETE /api/media/:id/like
// @access  Private
exports.unlikeMedia = asyncHandler(async (req, res) => {
  const media = await Media.findById(req.params.id);

  if (!media) {
    return res.status(404).json({
      success: false,
      message: 'Media not found'
    });
  }

  // Remove from likes
  media.likes = media.likes.filter(like => like.user.toString() !== req.user.id);
  await media.save();

  res.status(200).json({
    success: true,
    message: 'Media unliked successfully',
    likeCount: media.likes.length
  });
});

// @desc    Record media view
// @route   POST /api/media/:id/view
// @access  Private
exports.recordView = asyncHandler(async (req, res) => {
  const media = await Media.findById(req.params.id);

  if (!media) {
    return res.status(404).json({
      success: false,
      message: 'Media not found'
    });
  }

  // Check if user already viewed (to avoid duplicate views)
  const alreadyViewed = media.uniqueViews.find(view => 
    view.user && view.user.toString() === req.user.id
  );

  if (!alreadyViewed) {
    media.uniqueViews.push({
      user: req.user.id,
      ipAddress: req.ip
    });

    // Add to user's watch history
    const user = await User.findById(req.user.id);
    const existingHistory = user.watchHistory.find(item => 
      item.media.toString() === media._id.toString()
    );

    if (existingHistory) {
      existingHistory.watchedAt = new Date();
    } else {
      user.watchHistory.push({
        media: media._id,
        watchedAt: new Date()
      });
    }

    await Promise.all([media.save(), user.save()]);
  }

  res.status(200).json({
    success: true,
    message: 'View recorded',
    views: media.uniqueViews.length
  });
});

// @desc    Add media to favorites
// @route   POST /api/media/:id/favorite
// @access  Private
exports.addToFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const media = await Media.findById(req.params.id);

  if (!media) {
    return res.status(404).json({
      success: false,
      message: 'Media not found'
    });
  }

  if (user.favorites.includes(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Media already in favorites'
    });
  }

  user.favorites.push(req.params.id);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Added to favorites'
  });
});

// @desc    Remove media from favorites
// @route   DELETE /api/media/:id/favorite
// @access  Private
exports.removeFromFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  user.favorites = user.favorites.filter(fav => fav.toString() !== req.params.id);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Removed from favorites'
  });
});

// @desc    Report media
// @route   POST /api/media/:id/report
// @access  Private
exports.reportMedia = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const media = await Media.findById(req.params.id);

  if (!media) {
    return res.status(404).json({
      success: false,
      message: 'Media not found'
    });
  }

  // Check if user already reported this media
  const alreadyReported = media.flagReports.find(report => 
    report.reporter.toString() === req.user.id
  );

  if (alreadyReported) {
    return res.status(400).json({
      success: false,
      message: 'You have already reported this media'
    });
  }

  media.flagReports.push({
    reporter: req.user.id,
    reason: req.body.reason,
    description: req.body.description
  });

  // Flag media if it has multiple reports
  if (media.flagReports.length >= 3) {
    media.isFlagged = true;
    media.moderationStatus = 'under-review';
  }

  await media.save();

  logger.info(`Media reported: ${media.title} by ${req.user.username}`);

  res.status(200).json({
    success: true,
    message: 'Media reported successfully'
  });
});

// Additional controller methods for comments, search, etc. would go here...

// @desc    Add comment to media
// @route   POST /api/media/:id/comments
// @access  Private
exports.addComment = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const media = await Media.findById(req.params.id);

  if (!media) {
    return res.status(404).json({
      success: false,
      message: 'Media not found'
    });
  }

  const comment = await Comment.create({
    user: req.user.id,
    media: req.params.id,
    content: req.body.content,
    parentComment: req.body.parentComment || null,
    timestamp: req.body.timestamp || null
  });

  await comment.populate('user', 'username profile.avatar');

  // Add comment to media
  media.comments.push(comment._id);
  await media.save();

  res.status(201).json({
    success: true,
    message: 'Comment added successfully',
    data: comment
  });
});

// @desc    Get comments for media
// @route   GET /api/media/:id/comments
// @access  Private
exports.getComments = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  const comments = await Comment.find({ 
    media: req.params.id,
    parentComment: null // Only get top-level comments
  })
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit)
    .populate('user', 'username profile.avatar')
    .populate({
      path: 'replies',
      populate: {
        path: 'user',
        select: 'username profile.avatar'
      }
    });

  const total = await Comment.countDocuments({ 
    media: req.params.id,
    parentComment: null 
  });

  res.status(200).json({
    success: true,
    count: comments.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: comments
  });
});

// @desc    Search media
// @route   GET /api/media/search
// @access  Private
exports.searchMedia = asyncHandler(async (req, res) => {
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

  const searchQuery = {
    $text: { $search: req.query.q },
    isActive: true,
    moderationStatus: 'approved'
  };

  const media = await Media.find(searchQuery)
    .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
    .skip(startIndex)
    .limit(limit)
    .populate('creator', 'username profile.avatar isVerified')
    .select('-uniqueViews -flagReports');

  const total = await Media.countDocuments(searchQuery);

  res.status(200).json({
    success: true,
    count: media.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: media
  });
});

// @desc    Get trending media
// @route   GET /api/media/trending
// @access  Private
exports.getTrendingMedia = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 20;

  // Get media from last 7 days with high engagement
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const media = await Media.find({
    isActive: true,
    moderationStatus: 'approved',
    createdAt: { $gte: weekAgo }
  })
    .sort({ 
      'analytics.engagement': -1,
      views: -1,
      'likes.length': -1
    })
    .limit(limit)
    .populate('creator', 'username profile.avatar isVerified')
    .select('-uniqueViews -flagReports');

  res.status(200).json({
    success: true,
    count: media.length,
    data: media
  });
});

// @desc    Get creator's media
// @route   GET /api/media/creator/:creatorId
// @access  Private
exports.getCreatorMedia = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  const query = {
    creator: req.params.creatorId,
    isActive: true,
    moderationStatus: 'approved'
  };

  // If not the creator or admin, only show non-premium or accessible content
  if (req.params.creatorId !== req.user.id && req.user.role !== 'admin') {
    query.$or = [
      { isPremium: false },
      // Add subscription check here
    ];
  }

  const media = await Media.find(query)
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit)
    .populate('creator', 'username profile.avatar isVerified')
    .select('-uniqueViews -flagReports');

  const total = await Media.countDocuments(query);

  res.status(200).json({
    success: true,
    count: media.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: media
  });
});

// @desc    Update comment
// @route   PUT /api/media/comments/:commentId
// @access  Private (Owner only)
exports.updateComment = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const comment = req.resource; // From checkOwnership middleware

  // Save edit history
  comment.editHistory.push({
    content: comment.content,
    editedAt: new Date()
  });

  comment.content = req.body.content;
  comment.isEdited = true;
  await comment.save();

  await comment.populate('user', 'username profile.avatar');

  res.status(200).json({
    success: true,
    message: 'Comment updated successfully',
    data: comment
  });
});

// @desc    Delete comment
// @route   DELETE /api/media/comments/:commentId
// @access  Private (Owner only)
exports.deleteComment = asyncHandler(async (req, res) => {
  const comment = req.resource; // From checkOwnership middleware

  // Remove comment from media
  await Media.findByIdAndUpdate(comment.media, {
    $pull: { comments: comment._id }
  });

  await comment.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Comment deleted successfully'
  });
});