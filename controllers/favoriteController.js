// controllers/favoriteController.js
const pool = require('../db');

// Marcar o actualizar prioridad de favorito
exports.markFavorite = async (req, res) => {
  const { note_id, priority } = req.body;
  try {
    await pool.query(
      `INSERT INTO favorites (user_id, note_id, priority)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, note_id) DO UPDATE SET priority = $3`,
      [req.userId, note_id, priority]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error marcando favorito' });
  }
};

// Quitar favorito
exports.removeFavorite = async (req, res) => {
  const { note_id } = req.body;
  try {
    await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND note_id = $2',
      [req.userId, note_id]
    );
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error quitando favorito' });
  }
};

// Listar favoritos del usuario (con datos de nota)
exports.getFavorites = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT n.*, f.priority
       FROM favorites f
       JOIN notes n ON n.id = f.note_id
       WHERE f.user_id = $1
       ORDER BY f.priority DESC, n.title ASC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error obteniendo favoritos' });
  }
};
