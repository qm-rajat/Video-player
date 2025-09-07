const express = require('express');
const { body, query } = require('express-validator');
const {
  getDashboardStats,
  getReportedContent,
  moderateContent,
  getUsers,
  suspendUser,
  unsuspendUser,
  deleteUser,
  getPaymentStats,
  getSystemLogs
} = require('../controllers/admin');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Admin-only routes
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Content moderation
router.get('/reports', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('type').optional().isIn(['media', 'comment', 'user']),
  query('status').optional().isIn(['pending', 'under-review', 'resolved'])
], getReportedContent);

router.put('/moderate/:type/:id', [
  body('action').isIn(['approve', 'reject', 'remove']).withMessage('Invalid moderation action'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes too long')
], moderateContent);

// User management
router.get('/users', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('role').optional().isIn(['viewer', 'creator', 'admin']),
  query('status').optional().isIn(['active', 'suspended', 'inactive']),
  query('search').optional().isLength({ min: 1, max: 50 })
], getUsers);

router.put('/users/:id/suspend', [
  body('reason').notEmpty().withMessage('Suspension reason is required'),
  body('duration').optional().isInt({ min: 1 }).withMessage('Duration must be positive')
], suspendUser);

router.put('/users/:id/unsuspend', unsuspendUser);

router.delete('/users/:id', deleteUser);

// Analytics
router.get('/payments', getPaymentStats);

// System
router.get('/logs', [
  query('level').optional().isIn(['error', 'warn', 'info', 'debug']),
  query('limit').optional().isInt({ min: 1, max: 1000 })
], getSystemLogs);

module.exports = router;