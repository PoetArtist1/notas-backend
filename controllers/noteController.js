// controllers/noteController.js
const pool = require('../db');

// Crear nota
exports.createNote = async (req, res) => {
  const { title, description, is_public } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO notes (user_id, title, description, is_public)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.userId, title, description, is_public || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error creando nota' });
  }
};

// Obtener todas las notas (propias y públicas)
exports.getNotes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT n.*, f.priority
       FROM notes n
       LEFT JOIN favorites f ON f.note_id = n.id AND f.user_id = $1
       WHERE n.user_id = $1 OR n.is_public = TRUE
       ORDER BY f.priority DESC NULLS LAST, n.title ASC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error obteniendo notas' });
  }
};

// Obtener una nota por ID (asegurarse que sea propia o pública)
exports.getNoteById = async (req, res) => {
  const noteId = req.params.id;
  try {
    const result = await pool.query(
      `SELECT *
       FROM notes
       WHERE id = $1 AND (user_id = $2 OR is_public = TRUE)`,
      [noteId, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'Nota no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error obteniendo nota' });
  }
};

// Editar nota propia
exports.updateNote = async (req, res) => {
  const noteId = req.params.id;
  const { title, description, is_public } = req.body;
  try {
    const result = await pool.query(
      `UPDATE notes
       SET title = $1, description = $2, is_public = $3
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [title, description, is_public, noteId, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'Nota no encontrada o no autorizada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error actualizando nota' });
  }
};

// Eliminar nota propia
exports.deleteNote = async (req, res) => {
  const noteId = req.params.id;
  try {
    const result = await pool.query(
      'DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *',
      [noteId, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'Nota no encontrada o no autorizada' });
    }
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error eliminando nota' });
  }
};
