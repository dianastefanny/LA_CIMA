const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rutas de autenticación
router.post('/login', authController.login);
router.post('/registro', authController.registro);
router.get('/session', authController.getSession);

module.exports = router;