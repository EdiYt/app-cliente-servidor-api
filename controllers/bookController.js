const { booksDB } = require('../config/db');
const path = require('path');


exports.getBooks = (req, res) => {
    booksDB.query('SELECT * FROM libros', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error en la base de datos' });
        res.json(results);
    });
};

exports.addBook = (req, res) => {
    console.log('Iniciando addBook');
    console.log('Contenido de req.body:', req.body);
    console.log('Contenido de req.files:', req.files);

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: 'No se ha subido ningún archivo' });
    }

    const { nombre, autor, genero, estatus } = req.body;
    const pdfFile = req.files.pdf;
    const uploadPath = path.join(__dirname, '../uploads/', pdfFile.name);

    pdfFile.mv(uploadPath, (err) => {
        if (err) {
            console.error('Error al mover el archivo:', err);
            return res.status(500).json({ message: 'Error al subir el archivo', error: err.message });
        }

        console.log('Archivo PDF guardado exitosamente');

        booksDB.query(
            'INSERT INTO libros (nombre, autor, genero, estatus, pdf_path) VALUES (?, ?, ?, ?, ?)',
            [nombre, autor, genero, estatus === 'true' ? 1 : 0, uploadPath],
            (err, results) => {
                if (err) {
                    console.error('Error en la consulta de la base de datos:', err);
                    fs.unlink(uploadPath, (unlinkErr) => {
                        if (unlinkErr) console.error('Error al eliminar el archivo PDF:', unlinkErr);
                    });
                    return res.status(500).json({ message: 'Error en la base de datos', error: err.message });
                }
                console.log('Libro agregado exitosamente a la base de datos');
                res.status(201).json({ message: 'Libro agregado', id: results.insertId });
            }
        );
    });
};

exports.updateBook = (req, res) => {
    const { id } = req.params;
    const { nombre, autor, genero, estatus } = req.body;

    booksDB.query(
        'UPDATE libros SET nombre = ?, autor = ?, genero = ?, estatus = ? WHERE id = ?',
        [nombre, autor, genero, estatus, id],
        (err, results) => {
            if (err) return res.status(500).json({ message: 'Error en la base de datos' });
            res.json({ message: 'Libro actualizado' });
        }
    );
};

exports.getBookById = (req, res) => {
    const bookId = req.params.id;
    const query = 'SELECT * FROM libros WHERE id = ?';

    booksDB.query(query, [bookId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error en la base de datos' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Libro no encontrado' });
        }
        res.json(results[0]);
    });
};