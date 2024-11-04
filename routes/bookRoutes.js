const express = require('express');
const router = express.Router();
const bookController = require('../controllers/LibroController');

// Ruta para obtener libros de ambas fuentes
router.get('/all', bookController.getAllBooksPublicTodo); 

// Ruta para obtener todos los libros con nombres modificados (getAllPublico)
router.get('/publico', bookController.getAllPublico);

// Ruta para obtener un libro por ID
router.get('/:id', bookController.obtenerLibroId);

// Ruta para obtener todos los libros
router.get('/', bookController.obtenerTodosLibros);

// Ruta para crear un nuevo libro
router.post('/', bookController.crearLibro);

// Ruta para actualizar un libro
router.put('/:id', bookController.actualizarLibro);

module.exports = router;