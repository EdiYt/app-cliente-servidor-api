const express = require('express');
const router = express.Router();
const userController = require('../controllers/UsuarioController');

router.get('/', userController.obtenerUsuarios);         
router.get('/publico', userController.getAllPublico); 
router.get('/:id', userController.obtenerUsuarioId);
router.post('/register', userController.registrarUsuario);
router.put('/:id', userController.actualizarUsuario);

module.exports = router;
