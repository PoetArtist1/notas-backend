// routes/favoriteRoutes.js
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');

// Marcar/actualizar favorito
router.post(
  '/',
  [
    body('note_id').isInt().withMessage('note_id debe ser int'),
    body('priority').isInt({ min: 1, max: 5 }).withMessage('priority 1-5')
  ],
  favoriteController.markFavorite
);

// Quitar favorito
router.delete('/', favoriteController.removeFavorite);

// Listar todos los favoritos
router.get('/', favoriteController.getFavorites);

module.exports = router;
