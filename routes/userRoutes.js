const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Ruta para obtener todos los usuarios
router.get('/', userController.getUsers);

// Ruta para actualizar un usuario
router.put('/:id', userController.updateUser);

module.exports = router;
