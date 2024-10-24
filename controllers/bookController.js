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

// Insertamos un libro
async function createBook(req, res) {
    try {
        const { nombre, autor, genero } = req.body;
        let pdfUrl = null;

        if (req.files && req.files.pdf) {
            const pdfFile = req.files.pdf;
            const filePath = pdfFile.tempFilePath || pdfFile.path;

            if (!filePath) {
                throw new Error('No se pudo obtener el path del archivo.');
            }

            console.log("Subiendo el archivo a Cloudinary...");
            const uploadResponse = await cloudinary.uploader.upload(filePath, {
                folder: "biblioteca_pdfs",
                resource_type: "raw", 
                format: "pdf",        
                access_mode: "public" 
            });            

            pdfUrl = uploadResponse.secure_url;
            console.log("PDF subido a Cloudinary:", pdfUrl);

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error al eliminar el archivo temporal:', err);
                } else {
                    console.log('Archivo temporal eliminado:', filePath);
                }
            });
        }

        console.log("Insertando el libro en la base de datos...");
        const newBookId = await booksDao.insert({ nombre, autor, genero, pdf_path: pdfUrl });
        
        return res.status(201).json({
            message: 'Libro creado',
            bookId: newBookId,
            nombre,
            autor,
            genero,
            pdfUrl
        });
    } catch (err) {
        console.error("Error al crear el libro:", err);
        return res.status(500).json({ message: 'Error al crear el libro', error: err });
    }
}

// Actualizar un libro
async function updateBook(req, res) {
    try {
        const id = req.params.id;
        const { nombre, autor, genero, estatus } = req.body; 
        console.log('Datos recibidos para actualizar:', { nombre, autor, genero, estatus });
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

// Get All publico
async function getAllPublico(req, res) {
    try {
        const books = await booksDao.getAll();
        // Modificamos los nombres de las propiedades
        const modifiedBooks = books.map(book => ({
            bookId: book.id,
            titulo: book.nombre,
            escritor: book.autor,
            categoria: book.genero,
            pdfLink: book.pdf_path,
            disponibilidad: book.estatus
        }));
        res.json(modifiedBooks);
    } catch (err) {
        console.error('Error al obtener los libros públicos:', err);
        res.status(500).json({ message: 'Error al obtener los libros' });
    }
}

module.exports = {
    getAllBooks,
    getAllPublico,
    getBookById,
    createBook,
    updateBook,
};