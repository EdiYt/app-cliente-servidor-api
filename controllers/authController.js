const { loginDB } = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Registro de usuario
exports.register = (req, res) => {
    const { nombre, email, password } = req.body;

    // Verificar si ya existe el usuario
    loginDB.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error en la base de datos' });
        if (results.length > 0) return res.status(400).json({ message: 'El usuario ya existe' });

        // Encriptamos la contraseña
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ message: 'Error al encriptar la contraseña' });

            // Registramos un nuevo usuario
            loginDB.query('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)', [nombre, email, hashedPassword], (err, results) => {
                if (err) return res.status(500).json({ message: 'Error al registrar el usuario' });
                res.status(201).json({ message: 'Usuario registrado con éxito' });
            });
        });
    });
};

// Inicio de sesión
exports.login = (req, res) => {
    const { email, password } = req.body;

    loginDB.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error en la base de datos' });
        if (results.length === 0) return res.status(401).json({ message: 'Usuario no encontrado' });

        const user = results[0];
        // Verificar la contraseña
        bcrypt.compare(password, user.password, (err, match) => {
            if (err) return res.status(500).json({ message: 'Error al comparar contraseñas' });
            if (!match) return res.status(401).json({ message: 'Contraseña incorrecta' });

            const token = jwt.sign({ id: user.id }, 'tu_secreto', { expiresIn: '1h' });
            res.json({ auth: true, token });
        });
    });
};