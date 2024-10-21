const db = require('../config/db');

// Obtener todos los usuarios
exports.getUsers = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM usuarios'); 
        res.json(results);
    } catch (err) {
        console.error('Error al obtener usuarios:', err);
        return res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

// Obtener un usuario por ID
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(results[0]);
    } catch (err) {
        console.error('Error al obtener el usuario:', err);
        return res.status(500).json({ error: 'Error al obtener el usuario' });
    }
};

// Actualizar un usuario
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { nombre, email } = req.body;

    console.log({ id, nombre, email }); 

    try {
        const [result] = await db.query('UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?', [nombre, email, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario actualizado exitosamente' });
    } catch (err) {
        console.error('Error al actualizar el usuario:', err);
        return res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
};
