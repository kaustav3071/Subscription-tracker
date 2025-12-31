import jwt from 'jsonwebtoken';
import BlacklistToken from '../models/blacklistToken.model.js';

export async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not configured');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token is blacklisted (logged out)
    const blacklisted = await BlacklistToken.findOne({ token });
    if (blacklisted) {
      return res.status(401).json({ message: 'Token revoked' });
    }
    
    req.user = { id: payload.id || payload._id };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    console.error('Auth error:', err);
    return res.status(500).json({ message: 'Auth check failed' });
  }
}
