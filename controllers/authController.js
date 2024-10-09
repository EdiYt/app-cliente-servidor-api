const { loginDB } = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = (req, res) => {
    const { email, password } = req.body;

    loginDB.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error en la base de datos' });
        if (results.length === 0) return res.status(401).json({ message: 'Usuario no encontrado' });

        const user = results[0];
        bcrypt.compare(password, user.password, (err, match) => {
            if (err) return res.status(500).json({ message: 'Error al comparar contraseñas' });
            if (!match) return res.status(401).json({ message: 'Contraseña incorrecta' });

            const token = jwt.sign({ id: user.id }, 'tu_secreto', { expiresIn: '1h' });
            res.json({ auth: true, token });
        });
    });
};