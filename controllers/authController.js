const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Registro de usuario
exports.register = async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        // Verificar si ya existe el usuario
        const [results] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (results.length > 0) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Encriptado de contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Datos del usuario a registrar:', { nombre, email, password });

        // Registro de un nuevo usuario
        await db.query('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)', [nombre, email, hashedPassword]);
        
        console.log(`Usuario registrado con éxito: ${nombre}, ${email}, ${hashedPassword}`); 
        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (err) {
        console.error('Error al registrar el usuario:', err); 
        return res.status(500).json({ message: 'Error al registrar el usuario' });
    }
};

// Inicio de sesión
exports.login = async (req, res) => {
    const { email, password } = req.body;

    console.log(`Intento de inicio de sesión para el usuario: ${email}`);

    try {
        const [results] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (results.length === 0) {
            console.warn(`Usuario no encontrado: ${email}`); 
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const user = results[0];
        // Verificar la contraseña
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            console.warn(`Contraseña incorrecta para el usuario: ${email}`); 
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user.id }, 'tu_secreto', { expiresIn: '1h' });
        res.json({ auth: true, token });
        console.log(`Usuario ${email} ha iniciado sesión correctamente.`); 
    } catch (err) {
        console.error('Error al iniciar sesión:', err); 
        return res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};