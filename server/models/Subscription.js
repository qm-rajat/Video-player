const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  subscriber: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  tier: {
    type: String,
    enum: ['basic', 'premium', 'vip'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly'],
    default: 'monthly'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  renewalDate: {
    type: Date,
    required: true
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  paymentStatus: {
    type: String,
    enum: ['active', 'pending', 'past_due', 'cancelled', 'suspended'],
    default: 'pending'
  },
  stripeSubscriptionId: {
    type: String,
    required: true
  },
  stripeCustomerId: {
    type: String,
    required: true
  },
  stripePriceId: {
    type: String,
    required: true
  },
  paymentHistory: [{
    amount: Number,
    currency: String,
    status: {
      type: String,
      enum: ['succeeded', 'pending', 'failed', 'refunded']
    },
    stripePaymentIntentId: String,
    paidAt: Date,
    failureReason: String
  }],
  benefits: [{
    type: String,
    enum: [
      'exclusive-content',
      'early-access',
      'direct-messaging',
      'custom-requests',
      'live-streams',
      'behind-the-scenes',
      'merchandise-discount',
      'priority-support'
    ]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  cancelledAt: Date,
  cancellationReason: {
    type: String,
    enum: [
      'user-request',
      'payment-failure',
      'policy-violation',
      'creator-suspended',
      'other'
    ]
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundReason: String,
  notes: String,
  metadata: {
    source: {
      type: String,
      enum: ['web', 'mobile', 'api'],
      default: 'web'
    },
    campaign: String,
    referrer: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for days remaining
SubscriptionSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const endDate = new Date(this.endDate);
  const timeDiff = endDate.getTime() - now.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
});

// Virtual for total amount paid
SubscriptionSchema.virtual('totalPaid').get(function() {
  return this.paymentHistory
    .filter(payment => payment.status === 'succeeded')
    .reduce((total, payment) => total + payment.amount, 0);
});

// Virtual for subscription duration in days
SubscriptionSchema.virtual('subscriptionDuration').get(function() {
  const start = new Date(this.startDate);
  const end = new Date(this.endDate);
  const timeDiff = end.getTime() - start.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
});

// Index for efficient queries
SubscriptionSchema.index({ subscriber: 1, creator: 1 }, { unique: true });
SubscriptionSchema.index({ creator: 1, paymentStatus: 1 });
SubscriptionSchema.index({ subscriber: 1, paymentStatus: 1 });
SubscriptionSchema.index({ renewalDate: 1, paymentStatus: 1 });
SubscriptionSchema.index({ stripeSubscriptionId: 1 }, { unique: true });

// Middleware to set end date based on billing cycle
SubscriptionSchema.pre('save', function(next) {
  if (this.isNew && !this.endDate) {
    const startDate = new Date(this.startDate);
    let endDate;
    
    switch (this.billingCycle) {
      case 'monthly':
        endDate = new Date(startDate.setMonth(startDate.getMonth() + 1));
        break;
      case 'quarterly':
        endDate = new Date(startDate.setMonth(startDate.getMonth() + 3));
        break;
      case 'yearly':
        endDate = new Date(startDate.setFullYear(startDate.getFullYear() + 1));
        break;
      default:
        endDate = new Date(startDate.setMonth(startDate.getMonth() + 1));
    }
    
    this.endDate = endDate;
    this.renewalDate = endDate;
  }
  next();
});

// Static method to find active subscriptions
SubscriptionSchema.statics.findActive = function() {
  return this.find({
    paymentStatus: 'active',
    endDate: { $gt: new Date() }
  });
};

// Static method to find expiring subscriptions
SubscriptionSchema.statics.findExpiringSoon = function(days = 3) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    paymentStatus: 'active',
    renewalDate: { $lte: futureDate, $gt: new Date() }
  });
};

module.exports = mongoose.model('Subscription', SubscriptionSchema);