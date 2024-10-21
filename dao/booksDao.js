const db = require('../config/db'); 

// Método que devuelve todos los libros
async function getAll() {
    try {
        const [rows] = await db.query('SELECT * FROM libros'); 
        return rows;
    } catch (err) {
        console.error('Error en getAll:', err); 
        throw err;
    }
}

// Método que devuelve un libro por ID
async function getById(id) {
    try {
        const [rows] = await db.query('SELECT * FROM libros WHERE id = ?', [id]);
        return rows[0]; 
    } catch (err) {
        console.error('Error en getById:', err); 
        throw err;
    }
}

// Método que inserta un nuevo libro
async function insert(book) {
    const { nombre, autor, genero } = book; 
    const result = await db.query('INSERT INTO libros (nombre, autor, genero) VALUES (?, ?, ?)', [nombre, autor, genero]);
    return result[0].insertId; 
}

// Método que actualiza los datos de un libro
async function update(id, book) {
    try {
        const { nombre, autor, genero, estatus } = book; 
        const result = await db.query('UPDATE libros SET nombre = ?, autor = ?, genero = ?, estatus = ? WHERE id = ?', [nombre, autor, genero, estatus, id]);
        return result[0].affectedRows; 
    } catch (err) {
        console.error('Error en update:', err); 
        throw err;
    }
}

module.exports = {
    getAll,
    getById,
    insert,
    update,
};
