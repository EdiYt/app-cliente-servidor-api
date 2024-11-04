const express = require('express');
const router = express.Router();
const loginController = require('../controllers/LoginController');

// Ruta para registrar un usuario
router.post('/register', loginController.register);

// Ruta para iniciar sesión
router.post('/login', loginController.login);

// Exportar el router para ser usado en el servidor principal
module.exports = router;
