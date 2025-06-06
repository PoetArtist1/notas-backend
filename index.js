// index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authMiddleware = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas públicas
app.use('/api/auth', authRoutes);

// Rutas protegidas
app.use('/api/notes', authMiddleware, noteRoutes);
app.use('/api/favorites', authMiddleware, favoriteRoutes);
app.use('/api/categories', authMiddleware, categoryRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`⚡️ Servidor corriendo en puerto ${PORT}`);
});
