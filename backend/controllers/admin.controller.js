import User from '../models/User.model.js';

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
