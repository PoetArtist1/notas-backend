// controllers/authController.js
const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config();

// Registro (sin hashing, texto plano)
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ msg: 'Correo ya registrado' });
    }
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
      [username, email, password]
    );
    res.json({ userId: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error en registro' });
  }
};

// Login (texto plano)
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT id, password FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0 || result.rows[0].password !== password) {
      return res.status(401).json({ msg: 'Credenciales inválidas' });
    }
    const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error en login' });
  }
};

// Eliminar perfil (al borrar un usuario, en cascada se borran notas, categorías y favoritos)
exports.deleteUser = async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.userId]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al eliminar usuario' });
  }
};
