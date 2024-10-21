const { booksDB } = require('../config/db');

// Método que devuelve todos los libros
async function getAll() {
    const [rows] = await booksDB.query('SELECT * FROM libros');
    return rows;
}

// Método que devuelve un libro por ID
async function getById(id) {
    const [rows] = await booksDB.query('SELECT * FROM libros WHERE id = ?', [id]);
    return rows[0]; // Retorna el primer libro encontrado
}

// Método que inserta un nuevo libro
async function insert(book) {
    const { nombre, autor, genero, estatus } = book; 
    const result = await booksDB.query('INSERT INTO libros (nombre, autor, genero, estatus) VALUES (?, ?, ?, ?)', [nombre, autor, genero, estatus]);
    return result[0].insertId; // Retorna el ID del libro insertado
}

// Método que actualiza los datos de un libro
async function update(id, book) {
    const { nombre, autor, genero, estatus } = book; 
    const result = await booksDB.query('UPDATE libros SET nombre = ?, autor = ?, genero = ?, estatus = ? WHERE id = ?', [nombre, autor, genero, estatus, id]);
    return result[0].affectedRows; // Retorna el número de filas afectadas
}

module.exports = {
    getAll,
    getById,
    insert,
    update,
};
