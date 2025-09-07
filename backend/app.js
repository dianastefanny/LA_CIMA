require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors');

// Rutas
const authRoutes = require('./src/routes/authRoutes');

// App
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'la-cima-secret',
  resave: false,
  saveUninitialized: false
}));
// Archivos estáticos(CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Vistas principales
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/views/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/views/login.html'));
});

app.get('/bienvenida', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.sendFile(path.join(__dirname, '../frontend/public/views/bienvenida.html'));
});

// Usar rutas de autenticación
app.use('/auth', authRoutes);

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
module.exports = app; // 👉 Exporta la app para usarla en Supertest
