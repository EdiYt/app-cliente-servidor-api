const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Ruta para obtener todos los libros
router.get('/', bookController.getBooks);

// Ruta para agregar un nuevo libro
router.post('/', bookController.addBook);

// Ruta para actualizar un libro
router.put('/:id', bookController.updateBook);

router.get('/:id', bookController.getBookById); 

module.exports = router;
