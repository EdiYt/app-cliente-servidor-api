const { loginDB } = require('../config/db');
const bcrypt = require('bcrypt');

exports.getUsers = (req, res) => {
    loginDB.query('SELECT * FROM usuarios', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error en la base de datos' });
        res.json(results);
    });
};

// Actualizar un usuario
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { nombre, email, password } = req.body;

    try {
        // Primero, verificamos si el usuario existe
        loginDB.query('SELECT * FROM usuarios WHERE id = ?', [id], async (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error al buscar el usuario' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // El usuario existe, procedemos con la actualización
            let updateFields = [];
            let updateValues = [];

            if (nombre) {
                updateFields.push('nombre = ?');
                updateValues.push(nombre);
            }
            if (email) {
                updateFields.push('email = ?');
                updateValues.push(email);
            }
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                updateFields.push('password = ?');
                updateValues.push(hashedPassword);
            }

            if (updateFields.length === 0) {
                return res.status(400).json({ message: 'No se proporcionaron datos para actualizar' });
            }

            const updateQuery = `UPDATE usuarios SET ${updateFields.join(', ')} WHERE id = ?`;
            updateValues.push(id);

            loginDB.query(updateQuery, updateValues, (updateErr, updateResults) => {
                if (updateErr) {
                    console.error(updateErr);
                    return res.status(500).json({ message: 'Error al actualizar el usuario' });
                }
                res.json({ message: 'Usuario actualizado con éxito' });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};