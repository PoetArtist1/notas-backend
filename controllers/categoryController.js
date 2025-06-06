// controllers/categoryController.js
const pool = require('../db');

// Crear categoría
exports.createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO categories (user_id, name)
       VALUES ($1, $2)
       RETURNING *`,
      [req.userId, name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error creando categoría' });
  }
};

// Listar categorías del usuario
exports.getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories WHERE user_id = $1 ORDER BY name ASC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error listado categorías' });
  }
};

// Eliminar categoría (se removrá de note_category en cascada)
exports.deleteCategory = async (req, res) => {
  const catId = req.params.id;
  try {
    const result = await pool.query(
      'DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING *',
      [catId, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'Categoría no encontrada o no autorizada' });
    }
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error eliminando categoría' });
  }
};

// Agregar nota a categoría
exports.addNoteToCategory = async (req, res) => {
  const { note_id, category_id } = req.body;
  try {
    await pool.query(
      `INSERT INTO note_category (note_id, category_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [note_id, category_id]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error asociando nota a categoría' });
  }
};

// Remover nota de categoría
exports.removeNoteFromCategory = async (req, res) => {
  const { note_id, category_id } = req.body;
  try {
    await pool.query(
      'DELETE FROM note_category WHERE note_id = $1 AND category_id = $2',
      [note_id, category_id]
    );
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error removiendo nota de categoría' });
  }
};

// Listar notas por categoría
exports.getNotesByCategory = async (req, res) => {
  const catId = req.params.id;
  try {
    const result = await pool.query(
      `SELECT n.*, f.priority
       FROM note_category nc
       JOIN notes n ON n.id = nc.note_id
       LEFT JOIN favorites f ON f.note_id = n.id AND f.user_id = $1
       WHERE nc.category_id = $2
       ORDER BY f.priority DESC NULLS LAST, n.title ASC`,
      [req.userId, catId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error obteniendo notas por categoría' });
  }
};
