import User from '../models/User.model.js';

export async function requireAdmin(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    if (user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    next();
  } catch (err) {
    next(err);
  }
}
