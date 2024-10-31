const db = require('../config/db');

// Obtener todos los usuarios
async function getAll() {
    const [rows] = await db.query('SELECT * FROM usuarios');
    return rows;
}

// Obtener un usuario por ID
async function getById(id) {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    return rows[0];
}

// Insertar un nuevo usuario
async function insert(user) {
    const { nombre, email, password } = user;
    const [result] = await db.query(
        'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
        [nombre, email, password]
    );
    return result.insertId; 
}

// Actualizar un usuario
async function update(id, user) {
    const { nombre, email } = user;
    const [result] = await db.query(
        'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?',
        [nombre, email, id]
    );
    return result.affectedRows;
}

// Obtener el usuario por email
async function getByEmail(email) {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    return rows[0];
}

module.exports = {
    getAll,
    getByEmail,
    getById,
    insert,
    update,
};
