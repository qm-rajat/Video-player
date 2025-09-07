const express = require('express');
const { body } = require('express-validator');
const {
  createSubscription,
  cancelSubscription,
  updateSubscription,
  getSubscriptions,
  getSubscriptionPlans,
  handleWebhook,
  getPaymentHistory,
  createPaymentIntent,
  processRefund,
  getCreatorEarnings,
  requestPayout
} = require('../controllers/payments');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Webhook route (must be before other middleware)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Public routes
router.get('/plans', getSubscriptionPlans);

// Protected routes
router.use(protect);

// Subscription management
router.post('/subscribe', [
  body('creatorId').isMongoId().withMessage('Valid creator ID is required'),
  body('tier').isIn(['basic', 'premium', 'vip']).withMessage('Valid subscription tier is required'),
  body('billingCycle').optional().isIn(['monthly', 'quarterly', 'yearly']).withMessage('Valid billing cycle is required')
], createSubscription);

router.put('/subscription/:id', [
  body('tier').optional().isIn(['basic', 'premium', 'vip']),
  body('autoRenew').optional().isBoolean()
], updateSubscription);

router.delete('/subscription/:id', cancelSubscription);

router.get('/subscriptions', getSubscriptions);

router.get('/history', getPaymentHistory);

// One-time payments
router.post('/payment-intent', [
  body('amount').isFloat({ min: 0.5 }).withMessage('Amount must be at least $0.50'),
  body('currency').optional().isIn(['USD', 'EUR', 'GBP', 'CAD', 'AUD']).withMessage('Invalid currency'),
  body('mediaId').optional().isMongoId().withMessage('Valid media ID required'),
  body('description').optional().isLength({ max: 200 }).withMessage('Description too long')
], createPaymentIntent);

// Creator-only routes
router.use(authorize('creator', 'admin'));

router.get('/earnings', getCreatorEarnings);

router.post('/payout', [
  body('amount').isFloat({ min: 10 }).withMessage('Minimum payout amount is $10'),
  body('method').isIn(['bank_account', 'debit_card']).withMessage('Invalid payout method')
], requestPayout);

// Admin-only routes
router.use(authorize('admin'));

router.post('/refund', [
  body('paymentIntentId').notEmpty().withMessage('Payment Intent ID is required'),
  body('amount').optional().isFloat({ min: 0.01 }).withMessage('Refund amount must be positive'),
  body('reason').optional().isIn(['duplicate', 'fraudulent', 'requested_by_customer']).withMessage('Invalid refund reason')
], processRefund);

module.exports = router;