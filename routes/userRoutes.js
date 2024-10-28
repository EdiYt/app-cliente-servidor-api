const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Ruta para obtener todos los usuarios
router.get('/', userController.getUsers);

// Ruta para obtener un usuario por ID
router.get('/:id', userController.getUserById);

// Ruta para registrar un usuario
router.post('/register', userController.registerUser);

// Ruta para actualizar un usuario
router.put('/:id', userController.updateUser);

module.exports = router;
