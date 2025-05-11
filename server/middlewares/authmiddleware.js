const jwt = require('jsonwebtoken');
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  console.log(token);
  if (!token) {
    return res.status(401).json({ message: 'No token. Authorization denied.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(req.user)
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ message: 'Invalid token. Authorization denied.' });
  }
};

module.exports = authMiddleware;
