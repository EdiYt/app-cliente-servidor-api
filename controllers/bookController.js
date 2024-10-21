const cloudinary = require('../config/cloudinary'); 
const path = require('path');
const booksDao = require('../dao/booksDao');
const CQRSLibro = require('../cqrs/CQRSLibro');
const fs = require('fs');
const cqrsLibro = new CQRSLibro();

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

// Insertar un libro
async function createBook(req, res) {
    try {
        const { nombre, autor, genero } = req.body;
        let pdfUrl = null;

        if (req.files && req.files.pdf) {
            const pdfFile = req.files.pdf;
            const filePath = pdfFile.tempFilePath || pdfFile.path;

            const uploadResponse = await cloudinary.uploader.upload(filePath, {
                folder: "biblioteca_pdfs",
                resource_type: "raw",
                format: "pdf"
            });

            pdfUrl = uploadResponse.secure_url;
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error al eliminar el archivo temporal:', err);
            });
        }

        const newBookId = await cqrsLibro.insert(nombre, autor, genero, pdfUrl);

        res.status(201).json({
            message: 'Libro creado',
            bookId: newBookId,
            nombre,
            autor,
            genero,
            pdfUrl
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// Actualizar un libro
async function updateBook(req, res) {
    try {
        const { id } = req.params;
        const { nombre, autor, genero, estatus } = req.body;

        // Llamada a CQRS para actualizar el libro
        await cqrsLibro.update(id, nombre, autor, genero, estatus);

        res.json({ message: 'Libro actualizado' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
};