const express = require('express');
const { query } = require('express-validator');
const {
  getUsers,
  getUserById,
  followUser,
  unfollowUser,
  getUserFollowers,
  getUserFollowing,
  getUserFavorites,
  getUserWatchHistory,
  clearWatchHistory
} = require('../controllers/users');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protected routes
router.use(protect);

router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('role').optional().isIn(['viewer', 'creator', 'admin']),
  query('search').optional().isLength({ min: 1, max: 50 })
], getUsers);

router.get('/:id', getUserById);

router.post('/:id/follow', followUser);
router.delete('/:id/follow', unfollowUser);

router.get('/:id/followers', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], getUserFollowers);

router.get('/:id/following', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], getUserFollowing);

router.get('/me/favorites', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], getUserFavorites);

router.get('/me/history', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], getUserWatchHistory);

router.delete('/me/history', clearWatchHistory);

module.exports = router;