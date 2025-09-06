import User from '../models/User.model.js';
import Subscription from '../models/subscription.model.js';

export async function listUsers(req, res) {
  const users = await User.find({}).sort({ createdAt: -1 });
  res.json(users);
}

export async function getUser(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
}

export async function updateUser(req, res) {
  const { name, phone, isVerified } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: { name, phone, isVerified } },
    { new: true, runValidators: true }
  );
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
}

export async function deleteUser(req, res) {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ success: true });
}

export async function listUserSubscriptions(req, res) {
  const targetUser = await User.findById(req.params.id);
  if (!targetUser) return res.status(404).json({ message: 'User not found' });
  const filter = { user: targetUser._id };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category.toLowerCase();
  const subs = await Subscription.find(filter).sort({ nextChargeDate: 1 });
  res.json(subs);
}

// List ALL subscriptions across users (admin overview)
export async function listAllSubscriptions(req, res) {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category.toLowerCase();
  const subs = await Subscription.find(filter)
    .populate('user', 'email name')
    .sort({ nextChargeDate: 1 });
  res.json(subs);
}
