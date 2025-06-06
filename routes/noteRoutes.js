// routes/noteRoutes.js
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const noteController = require('../controllers/noteController');

// Crear nota
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('title requerido'),
    body('description').isLength({ max: 250 }).withMessage('descripción max 250 caracteres'),
  ],
  noteController.createNote
);

// Listar notas (propias + públicas)
router.get('/', noteController.getNotes);

// Obtener nota por ID
router.get('/:id', noteController.getNoteById);

// Editar nota propia
router.put(
  '/:id',
  [
    body('title').notEmpty().withMessage('title requerido'),
    body('description').isLength({ max: 250 }).withMessage('descripción max 250 caracteres'),
  ],
  noteController.updateNote
);

// Eliminar nota propia
router.delete('/:id', noteController.deleteNote);

module.exports = router;
