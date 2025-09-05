export function adminAuth(req, res, next) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Basic ')) return res.status(401).json({ message: 'Admin auth required' });
  const b64 = header.slice(6);
  let creds;
  try {
    const decoded = Buffer.from(b64, 'base64').toString('utf8');
    const idx = decoded.indexOf(':');
    if (idx === -1) throw new Error('Malformed');
    creds = { email: decoded.slice(0, idx), password: decoded.slice(idx + 1) };
  } catch {
    return res.status(400).json({ message: 'Invalid Basic auth header' });
  }

  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return res.status(500).json({ message: 'Admin not configured' });
  if (creds.email !== ADMIN_EMAIL || creds.password !== ADMIN_PASSWORD) return res.status(401).json({ message: 'Unauthorized' });

  req.admin = { email: ADMIN_EMAIL };
  next();
}
