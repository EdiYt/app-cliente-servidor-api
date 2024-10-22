const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Ruta para obtener todos los libros
router.get('/', bookController.getAllBooks);

// Ruta para obtener un libro por ID
router.get('/:id', bookController.getBookById);

// GetAll publico
router.get('/publico', bookController.getAllPublico);

// Ruta para crear un nuevo libro
router.post('/', bookController.createBook);

// Ruta para actualizar un libro
router.put('/:id', bookController.updateBook);

// Exportar el router para ser usado en el servidor principal
module.exports = router;
