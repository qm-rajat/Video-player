const { validationResult } = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const Media = require('../models/Media');
const { asyncHandler } = require('../middleware/asyncHandler');
const { logger } = require('../utils/logger');

// Subscription plans configuration
const SUBSCRIPTION_PLANS = {
  basic: {
    name: 'Basic',
    description: 'Access to basic content',
    features: ['Basic content access', 'Standard quality streaming'],
    prices: {
      monthly: { amount: 999, priceId: 'price_basic_monthly' }, // $9.99
      quarterly: { amount: 2699, priceId: 'price_basic_quarterly' }, // $26.99
      yearly: { amount: 9999, priceId: 'price_basic_yearly' } // $99.99
    }
  },
  premium: {
    name: 'Premium',
    description: 'Access to premium content',
    features: ['All basic features', 'Premium content access', 'HD streaming', 'Early access'],
    prices: {
      monthly: { amount: 1999, priceId: 'price_premium_monthly' }, // $19.99
      quarterly: { amount: 5399, priceId: 'price_premium_quarterly' }, // $53.99
      yearly: { amount: 19999, priceId: 'price_premium_yearly' } // $199.99
    }
  },
  vip: {
    name: 'VIP',
    description: 'Access to all content plus exclusive perks',
    features: ['All premium features', 'VIP content access', '4K streaming', 'Direct messaging', 'Custom requests'],
    prices: {
      monthly: { amount: 4999, priceId: 'price_vip_monthly' }, // $49.99
      quarterly: { amount: 13499, priceId: 'price_vip_quarterly' }, // $134.99
      yearly: { amount: 49999, priceId: 'price_vip_yearly' } // $499.99
    }
  }
};

// @desc    Get subscription plans
// @route   GET /api/payments/plans
// @access  Public
exports.getSubscriptionPlans = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: SUBSCRIPTION_PLANS
  });
});

// @desc    Create subscription
// @route   POST /api/payments/subscribe
// @access  Private
exports.createSubscription = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { creatorId, tier, billingCycle = 'monthly' } = req.body;

  // Check if creator exists
  const creator = await User.findById(creatorId);
  if (!creator || creator.role !== 'creator') {
    return res.status(404).json({
      success: false,
      message: 'Creator not found'
    });
  }

  // Check if user already has subscription to this creator
  const existingSubscription = await Subscription.findOne({
    subscriber: req.user.id,
    creator: creatorId,
    paymentStatus: 'active'
  });

  if (existingSubscription) {
    return res.status(400).json({
      success: false,
      message: 'You already have an active subscription to this creator'
    });
  }

  // Get or create Stripe customer
  let stripeCustomerId = req.user.stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: req.user.email,
      name: req.user.username,
      metadata: {
        userId: req.user.id
      }
    });
    stripeCustomerId = customer.id;
    
    await User.findByIdAndUpdate(req.user.id, {
      stripeCustomerId: stripeCustomerId
    });
  }

  // Get plan details
  const plan = SUBSCRIPTION_PLANS[tier];
  if (!plan) {
    return res.status(400).json({
      success: false,
      message: 'Invalid subscription tier'
    });
  }

  const priceInfo = plan.prices[billingCycle];
  if (!priceInfo) {
    return res.status(400).json({
      success: false,
      message: 'Invalid billing cycle'
    });
  }

  try {
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [{
        price: priceInfo.priceId,
        quantity: 1
      }],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/subscription/cancel`,
      metadata: {
        userId: req.user.id,
        creatorId: creatorId,
        tier: tier,
        billingCycle: billingCycle
      }
    });

    res.status(200).json({
      success: true,
      message: 'Checkout session created',
      data: {
        sessionId: session.id,
        url: session.url
      }
    });

  } catch (error) {
    logger.error('Stripe checkout session creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating checkout session'
    });
  }
});

// @desc    Cancel subscription
// @route   DELETE /api/payments/subscription/:id
// @access  Private
exports.cancelSubscription = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findOne({
    _id: req.params.id,
    subscriber: req.user.id
  });

  if (!subscription) {
    return res.status(404).json({
      success: false,
      message: 'Subscription not found'
    });
  }

  if (subscription.paymentStatus !== 'active') {
    return res.status(400).json({
      success: false,
      message: 'Subscription is not active'
    });
  }

  try {
    // Cancel in Stripe
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true
    });

    // Update local subscription
    subscription.autoRenew = false;
    subscription.cancelledAt = new Date();
    subscription.cancellationReason = 'user-request';
    await subscription.save();

    logger.info(`Subscription cancelled: ${subscription._id} by user ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully. Access will continue until the end of the billing period.',
      data: subscription
    });

  } catch (error) {
    logger.error('Subscription cancellation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling subscription'
    });
  }
});

// @desc    Update subscription
// @route   PUT /api/payments/subscription/:id
// @access  Private
exports.updateSubscription = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const subscription = await Subscription.findOne({
    _id: req.params.id,
    subscriber: req.user.id
  });

  if (!subscription) {
    return res.status(404).json({
      success: false,
      message: 'Subscription not found'
    });
  }

  try {
    const updates = {};

    // Update tier if provided
    if (req.body.tier && req.body.tier !== subscription.tier) {
      const newPlan = SUBSCRIPTION_PLANS[req.body.tier];
      if (!newPlan) {
        return res.status(400).json({
          success: false,
          message: 'Invalid subscription tier'
        });
      }

      const newPriceId = newPlan.prices[subscription.billingCycle].priceId;
      
      // Update in Stripe
      const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        items: [{
          id: stripeSubscription.items.data[0].id,
          price: newPriceId
        }],
        proration_behavior: 'create_prorations'
      });

      updates.tier = req.body.tier;
      updates.price = newPlan.prices[subscription.billingCycle].amount;
    }

    // Update auto-renewal if provided
    if (req.body.autoRenew !== undefined) {
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: !req.body.autoRenew
      });

      updates.autoRenew = req.body.autoRenew;
    }

    // Update local subscription
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).populate('creator', 'username profile.avatar');

    logger.info(`Subscription updated: ${subscription._id} by user ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'Subscription updated successfully',
      data: updatedSubscription
    });

  } catch (error) {
    logger.error('Subscription update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating subscription'
    });
  }
});

// @desc    Get user subscriptions
// @route   GET /api/payments/subscriptions
// @access  Private
exports.getSubscriptions = asyncHandler(async (req, res) => {
  const subscriptions = await Subscription.find({
    subscriber: req.user.id
  })
    .populate('creator', 'username profile.avatar isVerified')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: subscriptions.length,
    data: subscriptions
  });
});

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
exports.getPaymentHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  // Get subscriptions with payment history
  const subscriptions = await Subscription.find({
    subscriber: req.user.id
  })
    .populate('creator', 'username profile.avatar')
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  // Extract payment history
  const payments = [];
  subscriptions.forEach(sub => {
    sub.paymentHistory.forEach(payment => {
      payments.push({
        ...payment.toObject(),
        subscription: {
          id: sub._id,
          tier: sub.tier,
          creator: sub.creator
        }
      });
    });
  });

  // Sort by payment date
  payments.sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt));

  const total = payments.length;

  res.status(200).json({
    success: true,
    count: payments.length,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    },
    data: payments
  });
});

// @desc    Create payment intent for one-time purchases
// @route   POST /api/payments/payment-intent
// @access  Private
exports.createPaymentIntent = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { amount, currency = 'USD', mediaId, description } = req.body;

  try {
    // Get or create Stripe customer
    let stripeCustomerId = req.user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.username,
        metadata: {
          userId: req.user.id
        }
      });
      stripeCustomerId = customer.id;
      
      await User.findByIdAndUpdate(req.user.id, {
        stripeCustomerId: stripeCustomerId
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      customer: stripeCustomerId,
      description: description || 'Content purchase',
      metadata: {
        userId: req.user.id,
        mediaId: mediaId || '',
        type: 'one-time-purchase'
      }
    });

    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    });

  } catch (error) {
    logger.error('Payment intent creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment intent'
    });
  }
});

// @desc    Get creator earnings
// @route   GET /api/payments/earnings
// @access  Private (Creator only)
exports.getCreatorEarnings = asyncHandler(async (req, res) => {
  const creatorId = req.user.id;

  // Get all subscriptions to this creator
  const subscriptions = await Subscription.find({
    creator: creatorId,
    paymentStatus: 'active'
  });

  // Calculate earnings
  const totalSubscribers = subscriptions.length;
  const monthlyRevenue = subscriptions.reduce((total, sub) => {
    const monthlyAmount = sub.billingCycle === 'yearly' ? sub.price / 12 : 
                         sub.billingCycle === 'quarterly' ? sub.price / 3 : sub.price;
    return total + monthlyAmount;
  }, 0);

  // Get payment history for this creator
  const allSubscriptions = await Subscription.find({ creator: creatorId });
  let totalEarnings = 0;
  let pendingEarnings = 0;

  allSubscriptions.forEach(sub => {
    sub.paymentHistory.forEach(payment => {
      if (payment.status === 'succeeded') {
        totalEarnings += payment.amount;
      } else if (payment.status === 'pending') {
        pendingEarnings += payment.amount;
      }
    });
  });

  // Platform fee (typically 20-30%)
  const platformFee = 0.25; // 25%
  const netEarnings = totalEarnings * (1 - platformFee);
  const netPending = pendingEarnings * (1 - platformFee);

  res.status(200).json({
    success: true,
    data: {
      totalSubscribers,
      monthlyRevenue: monthlyRevenue / 100, // Convert from cents
      totalEarnings: totalEarnings / 100,
      netEarnings: netEarnings / 100,
      pendingEarnings: netPending / 100,
      platformFee: platformFee * 100 + '%'
    }
  });
});

// @desc    Request payout
// @route   POST /api/payments/payout
// @access  Private (Creator only)
exports.requestPayout = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  // This would integrate with Stripe Connect for creator payouts
  // For now, we'll just log the request
  
  logger.info(`Payout requested by creator ${req.user.id}: $${req.body.amount}`);

  res.status(200).json({
    success: true,
    message: 'Payout request submitted. It will be processed within 1-2 business days.'
  });
});

// @desc    Process refund
// @route   POST /api/payments/refund
// @access  Private (Admin only)
exports.processRefund = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { paymentIntentId, amount, reason } = req.body;

  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined, // Convert to cents
      reason: reason || 'requested_by_customer'
    });

    logger.info(`Refund processed by admin ${req.user.id}: ${refund.id}`);

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      }
    });

  } catch (error) {
    logger.error('Refund processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing refund'
    });
  }
});

// @desc    Handle Stripe webhooks
// @route   POST /api/payments/webhook
// @access  Public (Stripe only)
exports.handleWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object);
      break;
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object);
      break;
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object);
      break;
    default:
      logger.info(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// Helper functions for webhook handlers
async function handleCheckoutSessionCompleted(session) {
  try {
    const { userId, creatorId, tier, billingCycle } = session.metadata;
    const stripeSubscription = await stripe.subscriptions.retrieve(session.subscription);

    const subscription = await Subscription.create({
      subscriber: userId,
      creator: creatorId,
      tier,
      billingCycle,
      price: stripeSubscription.items.data[0].price.unit_amount,
      stripeSubscriptionId: stripeSubscription.id,
      stripeCustomerId: session.customer,
      stripePriceId: stripeSubscription.items.data[0].price.id,
      paymentStatus: 'active',
      startDate: new Date(stripeSubscription.current_period_start * 1000),
      endDate: new Date(stripeSubscription.current_period_end * 1000),
      renewalDate: new Date(stripeSubscription.current_period_end * 1000)
    });

    logger.info(`Subscription created: ${subscription._id}`);
  } catch (error) {
    logger.error('Error handling checkout session completed:', error);
  }
}

async function handlePaymentSucceeded(invoice) {
  try {
    const subscription = await Subscription.findOne({
      stripeSubscriptionId: invoice.subscription
    });

    if (subscription) {
      subscription.paymentHistory.push({
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: 'succeeded',
        stripePaymentIntentId: invoice.payment_intent,
        paidAt: new Date(invoice.status_transitions.paid_at * 1000)
      });

      subscription.paymentStatus = 'active';
      await subscription.save();

      logger.info(`Payment succeeded for subscription: ${subscription._id}`);
    }
  } catch (error) {
    logger.error('Error handling payment succeeded:', error);
  }
}

async function handlePaymentFailed(invoice) {
  try {
    const subscription = await Subscription.findOne({
      stripeSubscriptionId: invoice.subscription
    });

    if (subscription) {
      subscription.paymentHistory.push({
        amount: invoice.amount_due,
        currency: invoice.currency,
        status: 'failed',
        stripePaymentIntentId: invoice.payment_intent,
        failureReason: invoice.last_finalization_error?.message
      });

      subscription.paymentStatus = 'past_due';
      await subscription.save();

      logger.info(`Payment failed for subscription: ${subscription._id}`);
    }
  } catch (error) {
    logger.error('Error handling payment failed:', error);
  }
}

async function handleSubscriptionDeleted(stripeSubscription) {
  try {
    const subscription = await Subscription.findOne({
      stripeSubscriptionId: stripeSubscription.id
    });

    if (subscription) {
      subscription.paymentStatus = 'cancelled';
      subscription.cancelledAt = new Date();
      await subscription.save();

      logger.info(`Subscription cancelled: ${subscription._id}`);
    }
  } catch (error) {
    logger.error('Error handling subscription deleted:', error);
  }
}