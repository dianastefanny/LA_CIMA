require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS para Angular
app.use(cors({
  origin: 'http://localhost:4200', // URL de tu frontend Angular
  credentials: true
}));

// Middleware para JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/auth', authRoutes);

// Servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;