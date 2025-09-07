const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rutas de autenticación
router.post('/login', authController.login);
router.post('/registro', authController.registro);
router.post('/logout', authController.logout);
router.get('/api/session', authController.getSession);

// Logout para <a href="/logout">
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;