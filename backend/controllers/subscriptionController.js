import Subscription from '../models/Subscription.js';

export async function listSubscriptions(req, res) {
  const items = await Subscription.find({ user: req.user.id }).sort({ nextChargeDate: 1 });
  res.json(items);
}

export async function getSubscription(req, res) {
  const item = await Subscription.findOne({ _id: req.params.id, user: req.user.id });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
}

export async function createSubscription(req, res) {
  const data = { ...req.body, user: req.user.id };
  const item = await Subscription.create(data);
  res.status(201).json(item);
}

export async function updateSubscription(req, res) {
  const item = await Subscription.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
}

export async function deleteSubscription(req, res) {
  const item = await Subscription.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ success: true });
}
