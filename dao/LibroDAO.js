const db = require('../config/db');

// Método que devuelve todos los libros
async function getAll() {
    const [rows] = await db.query('SELECT * FROM libros');
    return rows;
}

// Método que devuelve un libro por ID
async function getById(id) {
    const [rows] = await db.query('SELECT * FROM libros WHERE id = ?', [id]);
    return rows[0]; 
}

async function insert(bookData) {
    const { nombre, autor, genero, universidad, pdf_path } = bookData;
    const result = await db.query(
        `INSERT INTO libros (nombre, autor, genero, universidad, pdf_path) VALUES (?, ?, ?, ?, ?)`,
        [nombre, autor, genero, universidad, pdf_path]
    );
    return result.insertId;
}

// Método que actualiza los datos de un libro
async function update(id, book) {
    const { nombre, autor, genero, estatus } = book; 
    const result = await db.query(
        'UPDATE libros SET nombre = ?, autor = ?, genero = ?, estatus = ? WHERE id = ?',
        [nombre, autor, genero, estatus, id]
    );
    return result[0].affectedRows; 
}

module.exports = {
    getAll,
    getById,
    insert,
    update,
};
