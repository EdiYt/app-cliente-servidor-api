const db = require('../config/db');
const booksDao = require('../dao/booksDao');

// Obtener todos los libros
async function getAllBooks(req, res) {
    try {
        const books = await booksDao.getAll();
        console.log(books);
        res.json(books);
    } catch (err) {
        console.error('Error al obtener los libros:', err);
        res.status(500).json({ message: 'Error al obtener los libros', error: err });
    }
}

// Obtener un libro por su ID
async function getBookById(req, res) {
    try {
        const id = req.params.id;
        const book = await booksDao.getById(id);
        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ message: 'Libro no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener el libro', error: err });
    }
}

// Insertar un nuevo libro
async function createBook(req, res) {
    try {
        const { nombre, autor, genero } = req.body; // No incluimos estatus
        const newBookId = await booksDao.insert({ nombre, autor, genero });
        res.status(201).json({ message: 'Libro creado', bookId: newBookId });
    } catch (err) {
        res.status(500).json({ message: 'Error al crear el libro', error: err });
    }
}

// Actualizar un libro
async function updateBook(req, res) {
    try {
        const id = req.params.id;
        const { nombre, autor, genero, estatus } = req.body; 
        const affectedRows = await booksDao.update(id, { nombre, autor, genero, estatus });
        if (affectedRows > 0) {
            res.json({ message: 'Libro actualizado' });
        } else {
            res.status(404).json({ message: 'Libro no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar el libro', error: err });
    }
}

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
};
