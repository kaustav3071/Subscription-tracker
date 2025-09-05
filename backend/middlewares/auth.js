import jwt from 'jsonwebtoken';
import BlacklistToken from '../models/blacklistToken.model.js';

export function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Check if token is blacklisted (logged out)
    BlacklistToken.findOne({ token })
      .then((bl) => {
        if (bl) return res.status(401).json({ message: 'Token revoked' });
        req.user = { id: payload.id || payload._id };
        next();
      })
      .catch(() => res.status(500).json({ message: 'Auth check failed' }));
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
