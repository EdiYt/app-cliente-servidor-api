const { loginDB } = require('../config/db');

exports.getUsers = (req, res) => {
    loginDB.query('SELECT * FROM usuarios', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error en la base de datos' });
        res.json(results);
    });
};

exports.updateUser = (req, res) => {
    const { id } = req.params;
    const { nombre, email, password } = req.body;

    // Aqui se encripta la nueva contraseña
    const hashedPassword = bcrypt.hashSync(password, 10);

    loginDB.query(
        'UPDATE usuarios SET nombre = ?, email = ?, password = ? WHERE id = ?',
        [nombre, email, hashedPassword, id],
        (err, results) => {
            if (err) return res.status(500).json({ message: 'Error en la base de datos' });
            res.json({ message: 'Usuario actualizado' });
        }
    );
};