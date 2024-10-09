const { booksDB } = require('../config/db');

exports.getBooks = (req, res) => {
    booksDB.query('SELECT * FROM libros', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error en la base de datos' });
        res.json(results);
    });
};

exports.addBook = (req, res) => {
    const { nombre, autor, genero, estatus } = req.body;

    booksDB.query(
        'INSERT INTO libros (nombre, autor, genero, estatus) VALUES (?, ?, ?, ?)',
        [nombre, autor, genero, estatus],
        (err, results) => {
            if (err) return res.status(500).json({ message: 'Error en la base de datos' });
            res.status(201).json({ message: 'Libro agregado', id: results.insertId });
        }
    );
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