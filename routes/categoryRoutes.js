// routes/categoryRoutes.js
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Crear categoría
router.post(
  '/',
  [body('name').notEmpty().withMessage('name requerido')],
  categoryController.createCategory
);

// Listar categorías
router.get('/', categoryController.getCategories);

// Eliminar categoría
router.delete('/:id', categoryController.deleteCategory);

// Agregar nota a categoría
router.post('/add-note', categoryController.addNoteToCategory);

// Remover nota de categoría
router.delete('/remove-note', categoryController.removeNoteFromCategory);

// Listar notas por categoría
router.get('/:id/notes', categoryController.getNotesByCategory);

module.exports = router;
