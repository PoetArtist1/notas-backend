// routes/authRoutes.js
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

// Registro: validar campos
router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('username requerido'),
    body('email').isEmail().withMessage('email inválido'),
    body('password').isLength({ min: 4 }).withMessage('password min 4 caracteres')
  ],
  authController.register
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('email inválido'),
    body('password').notEmpty().withMessage('contraseña requerida')
  ],
  authController.login
);

// Eliminar perfil (requiere auth)
const authMiddleware = require('../middleware/auth');
router.delete('/me', authMiddleware, authController.deleteUser);

module.exports = router;
