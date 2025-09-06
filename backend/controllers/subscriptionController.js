import Subscription from '../models/subscription.model.js';
import User from '../models/User.model.js';
import { notifySubscriptionUpdated, notifySubscriptionDeleted } from '../services/notification.service.js';
import { autoCategorize } from '../services/categorize.service.js';

export async function listSubscriptions(req, res) {
  const filter = { user: req.user.id };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category.toLowerCase();
  const items = await Subscription.find(filter).sort({ nextChargeDate: 1 });
  res.json(items);
}

export async function getSubscription(req, res) {
  const item = await Subscription.findOne({ _id: req.params.id, user: req.user.id });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
}

export async function createSubscription(req, res) {
  const {
    name,
    provider,
    plan,
    description,
    amount,
    cost,
    currency,
    billingCycle,
    intervalCount,
    startDate,
    nextChargeDate,
  category,
    tags,
    url,
    accountEmail,
    paymentMethod,
  } = req.body || {};

  const finalAmount = amount ?? cost;
  if (finalAmount == null) return res.status(400).json({ message: 'amount is required' });
  if (!name) return res.status(400).json({ message: 'name is required' });

  let resolvedCategory = category;
  if (!resolvedCategory) {
    resolvedCategory = await autoCategorize({ userId: req.user.id, name, provider });
  }

  const payload = {
    user: req.user.id,
    name,
    provider,
    plan,
    description,
    amount: finalAmount,
    currency,
    billingCycle,
    intervalCount,
    startDate,
    nextChargeDate,
    category: resolvedCategory,
    tags,
    url,
    accountEmail,
    paymentMethod,
  };

  if (!payload.nextChargeDate) {
    payload.nextChargeDate = Subscription.computeNextChargeDate(
      payload.startDate,
      payload.billingCycle,
      payload.intervalCount
    );
  }

  const item = await Subscription.create(payload);
  res.status(201).json(item);
}

export async function updateSubscription(req, res) {
  const updates = { ...req.body };
  // Prevent changing ownership
  delete updates.user;
  delete updates.userId;
  // Map cost->amount if provided
  if (updates.cost != null && updates.amount == null) updates.amount = updates.cost;
  // If category not provided but name/provider changed, re-auto-categorize
  if (!updates.category && (updates.name || updates.provider)) {
    const existing = await Subscription.findOne({ _id: req.params.id, user: req.user.id }, 'name provider');
    if (!existing) return res.status(404).json({ message: 'Not found' });
    const newName = updates.name ?? existing.name;
    const newProvider = updates.provider ?? existing.provider;
    updates.category = await autoCategorize({ userId: req.user.id, name: newName, provider: newProvider });
  }
  const item = await Subscription.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    updates,
    { new: true, runValidators: true }
  );
  if (!item) return res.status(404).json({ message: 'Not found' });
  // Notify user (best effort)
  try {
    const user = await User.findById(req.user.id);
    if (user) await notifySubscriptionUpdated(user, item, updates);
  } catch {}
  res.json(item);
}

export async function deleteSubscription(req, res) {
  const item = await Subscription.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!item) return res.status(404).json({ message: 'Not found' });
  try {
    const user = await User.findById(req.user.id);
    if (user) await notifySubscriptionDeleted(user, item.name);
  } catch {}
  res.json({ success: true });
}
