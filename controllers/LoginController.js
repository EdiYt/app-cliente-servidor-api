const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const usersDao = require('../dao/UsuarioDAO'); 

// Registro de usuario
exports.register = async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        const existingUser = await usersDao.getByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const rol = 'alumno'; 

        console.log('Datos del usuario a registrar:', { nombre, email, password });

        await usersDao.insert({ nombre, email, password: hashedPassword, rol });
        
        console.log(`Usuario registrado con éxito: ${nombre}, ${email}, ${hashedPassword}`);
        return res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (err) {
        console.error('Error al registrar el usuario:', err); 
        return res.status(500).json({ message: 'Error al registrar el usuario' });
    }
};

// Inicio de sesión
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await usersDao.getByEmail(email); 
        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user.id }, 'tu_secreto', { expiresIn: '1h' });
        res.json({ auth: true, token, user }); 
    } catch (err) {
        console.error('Error al iniciar sesión:', err); 
        return res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};