// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ msg: 'Sin token de autorización' });

  const token = header.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'Token mal formado' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(403).json({ msg: 'Token inválido' });
  }
};
