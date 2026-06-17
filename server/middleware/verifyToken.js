const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

module.exports = function verifyToken(req, res, next) {
  // Check Authorization header (Bearer) or cookie named `token`
  const authHeader = req.headers.authorization || '';
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) return res.status(401).json({ error: 'Authentication token missing' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // e.g., { userId, email, iat, exp }
    next();
  } catch (err) {
    console.error('Token verify error:', err.message || err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
