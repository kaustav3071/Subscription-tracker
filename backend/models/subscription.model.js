import mongoose from 'mongoose';
import validator from 'validator';

const { Schema } = mongoose;

const CYCLES = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom'];
const NOTIFY_CHANNELS = ['email', 'sms', 'push'];
const PAYMENT_METHODS = ['card', 'bank', 'paypal', 'upi', 'crypto', 'cash', 'other'];

const subscriptionSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    provider: { type: String, trim: true, maxlength: 120 },
    plan: { type: String, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 2000 },

    amount: { type: Number, required: true, min: 0 },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
      validate: {
        validator: (v) => /^[A-Z]{3}$/.test(v || ''),
        message: 'Currency must be a 3-letter ISO code',
      },
    },

    billingCycle: { type: String, enum: CYCLES, default: 'monthly' },
    intervalCount: { type: Number, default: 1, min: 1 },

    startDate: { type: Date, default: () => new Date() },
    nextChargeDate: { type: Date, validate: { validator: (v) => !v || !isNaN(new Date(v).getTime()), message: 'Invalid nextChargeDate' } },
    lastChargedDate: { type: Date },
    endDate: { type: Date },

    status: { type: String, enum: ['active', 'paused', 'canceled'], default: 'active', index: true },
    autoRenew: { type: Boolean, default: true },
    archived: { type: Boolean, default: false },

    reminderDaysBefore: { type: Number, min: 0, max: 365, default: 3 },
    notifyChannels: { type: [String], enum: NOTIFY_CHANNELS, default: ['email'] },

    // category stores a slug (e.g., 'ott', 'gaming'); it's free-form to allow user-defined categories
    category: { type: String, trim: true, lowercase: true, default: 'other', maxlength: 60 },
    tags: [{ type: String, trim: true }],
    url: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => !v || validator.isURL(v, { require_protocol: true }),
        message: 'url must be a valid URL with protocol (e.g., https://...)',
      },
    },
    accountEmail: {
      type: String,
      trim: true,
      lowercase: true,
      validate: { validator: (v) => !v || validator.isEmail(v), message: 'Invalid account email' },
    },
    paymentMethod: { type: String, enum: PAYMENT_METHODS },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
subscriptionSchema.index({ user: 1, status: 1 });
subscriptionSchema.index({ user: 1, nextChargeDate: 1 });
subscriptionSchema.index({ name: 'text', provider: 'text', plan: 'text', category: 'text', tags: 'text' });

// Compute next charge date utility
function addInterval(date, cycle, count) {
  const d = new Date(date);
  switch (cycle) {
    case 'daily':
      d.setDate(d.getDate() + count);
      break;
    case 'weekly':
      d.setDate(d.getDate() + 7 * count);
      break;
    case 'monthly':
      d.setMonth(d.getMonth() + count);
      break;
    case 'quarterly':
      d.setMonth(d.getMonth() + 3 * count);
      break;
    case 'yearly':
      d.setFullYear(d.getFullYear() + count);
      break;
    case 'custom':
      d.setMonth(d.getMonth() + count);
      break;
    default:
      d.setMonth(d.getMonth() + count);
  }
  return d;
}

subscriptionSchema.statics.computeNextChargeDate = function (fromDate, cycle, count = 1) {
  return addInterval(fromDate || new Date(), cycle || 'monthly', count || 1);
};

// Ensure nextChargeDate is set if missing
subscriptionSchema.pre('validate', function (next) {
  if (!this.nextChargeDate && this.startDate) {
    this.nextChargeDate = addInterval(this.startDate, this.billingCycle, this.intervalCount);
  }
  next();
});

// Virtual: annualized cost (approximate)
subscriptionSchema.virtual('annualCost').get(function () {
  const map = { daily: 365, weekly: 52, monthly: 12, quarterly: 4, yearly: 1, custom: 12 };
  const perYear = map[this.billingCycle] || 12;
  return (this.amount || 0) * (perYear / (this.intervalCount || 1));
});

// --- Currency conversion helpers (basic, static rates) ---
// NOTE: For production you'd fetch live FX rates and cache them.
// These are illustrative sample multipliers to convert FROM given currency TO INR.
const RATES_TO_INR = {
  INR: 1,
  USD: 83, // approximate
  EUR: 90,
  GBP: 105,
  JPY: 0.55,
  AUD: 55,
  CAD: 60,
  SGD: 62,
};

function toINR(amount, currency) {
  if (amount == null) return 0;
  const rate = RATES_TO_INR[currency?.toUpperCase?.()] || 1; // fallback assume already INR
  return amount * rate;
}

subscriptionSchema.virtual('amountINR').get(function () {
  return toINR(this.amount || 0, this.currency || 'INR');
});

subscriptionSchema.virtual('annualCostINR').get(function () {
  const baseAnnual = this.annualCost || 0;
  return toINR(baseAnnual, this.currency || 'INR');
});

// Instance helpers
subscriptionSchema.methods.pause = function () {
  this.status = 'paused';
  this.autoRenew = false;
  return this.save();
};

subscriptionSchema.methods.resume = function () {
  this.status = 'active';
  this.autoRenew = true;
  if (!this.nextChargeDate) {
    this.nextChargeDate = addInterval(new Date(), this.billingCycle, this.intervalCount);
  }
  return this.save();
};

subscriptionSchema.methods.cancel = function () {
  this.status = 'canceled';
  this.autoRenew = false;
  this.endDate = new Date();
  return this.save();
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
