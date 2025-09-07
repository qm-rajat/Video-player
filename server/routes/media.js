const express = require('express');
const { body, query } = require('express-validator');
const multer = require('multer');
const {
  getMedia,
  getMediaById,
  uploadMedia,
  updateMedia,
  deleteMedia,
  likeMedia,
  unlikeMedia,
  addComment,
  getComments,
  updateComment,
  deleteComment,
  reportMedia,
  addToFavorites,
  removeFromFavorites,
  getCreatorMedia,
  searchMedia,
  getTrendingMedia,
  recordView
} = require('../controllers/media');
const { protect, authorize, requireAgeVerification, checkOwnership, checkSubscriptionAccess } = require('../middleware/auth');
const Media = require('../models/Media');
const Comment = require('../models/Comment');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB
    files: 5
  },
  fileFilter: (req, file, cb) => {
    // Allow images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'), false);
    }
  }
});

// Public routes (with age verification)
router.get('/', [
  requireAgeVerification,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('category').optional().isIn(['amateur', 'professional', 'couples', 'solo-female', 'solo-male', 'group', 'fetish', 'bdsm', 'roleplay', 'vintage', 'other']),
  query('sort').optional().isIn(['newest', 'oldest', 'popular', 'trending', 'most-liked'])
], getMedia);

router.get('/search', [
  requireAgeVerification,
  query('q').notEmpty().withMessage('Search query is required'),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], searchMedia);

router.get('/trending', [requireAgeVerification], getTrendingMedia);

router.get('/creator/:creatorId', [
  requireAgeVerification,
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], getCreatorMedia);

// Protected routes
router.use(protect);

router.get('/:id', [requireAgeVerification, checkSubscriptionAccess], getMediaById);

router.post('/:id/view', [requireAgeVerification], recordView);

router.post('/:id/like', [requireAgeVerification], likeMedia);
router.delete('/:id/like', [requireAgeVerification], unlikeMedia);

router.post('/:id/favorite', [requireAgeVerification], addToFavorites);
router.delete('/:id/favorite', [requireAgeVerification], removeFromFavorites);

router.post('/:id/report', [
  requireAgeVerification,
  body('reason').isIn(['inappropriate-content', 'copyright-violation', 'spam', 'harassment', 'underage', 'non-consensual', 'violence', 'other']),
  body('description').optional().isLength({ max: 500 })
], reportMedia);

// Comment routes
router.get('/:id/comments', [
  requireAgeVerification,
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], getComments);

router.post('/:id/comments', [
  requireAgeVerification,
  body('content').notEmpty().isLength({ max: 1000 }).withMessage('Comment must be between 1 and 1000 characters'),
  body('parentComment').optional().isMongoId().withMessage('Invalid parent comment ID'),
  body('timestamp').optional().isInt({ min: 0 }).withMessage('Timestamp must be a positive integer')
], addComment);

router.put('/comments/:commentId', [
  checkOwnership(Comment, 'commentId'),
  body('content').notEmpty().isLength({ max: 1000 }).withMessage('Comment must be between 1 and 1000 characters')
], updateComment);

router.delete('/comments/:commentId', [
  checkOwnership(Comment, 'commentId')
], deleteComment);

// Creator-only routes
router.use(authorize('creator', 'admin'));

router.post('/upload', [
  upload.fields([
    { name: 'media', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]),
  body('title').notEmpty().isLength({ max: 100 }).withMessage('Title is required and must be under 100 characters'),
  body('description').optional().isLength({ max: 2000 }).withMessage('Description must be under 2000 characters'),
  body('category').isIn(['amateur', 'professional', 'couples', 'solo-female', 'solo-male', 'group', 'fetish', 'bdsm', 'roleplay', 'vintage', 'other']),
  body('tags').optional().isArray({ max: 10 }).withMessage('Maximum 10 tags allowed'),
  body('tags.*').optional().isLength({ max: 30 }).withMessage('Each tag must be under 30 characters'),
  body('isPremium').optional().isBoolean(),
  body('subscriptionTier').optional().isIn(['free', 'basic', 'premium', 'vip']),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be 0 or greater'),
  body('scheduledPublishAt').optional().isISO8601().withMessage('Invalid scheduled publish date')
], uploadMedia);

router.put('/:id', [
  checkOwnership(Media),
  body('title').optional().isLength({ max: 100 }),
  body('description').optional().isLength({ max: 2000 }),
  body('tags').optional().isArray({ max: 10 }),
  body('tags.*').optional().isLength({ max: 30 }),
  body('isPremium').optional().isBoolean(),
  body('subscriptionTier').optional().isIn(['free', 'basic', 'premium', 'vip']),
  body('price').optional().isFloat({ min: 0 })
], updateMedia);

router.delete('/:id', [checkOwnership(Media)], deleteMedia);

module.exports = router;