const usersDao = require('../dao/usersDao');

// Obtener todos los usuarios 
async function getUsers(req, res) {
    try {
        const users = await usersDao.getAll(); 
        res.json(users);
    } catch (err) {
        console.error('Error al obtener usuarios:', err);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
}


// Obtener todos los usuarios, getAllPublico
async function getAllPublico(req, res) {
    try {
        const users = await usersDao.getAll(); 
        
        const transformedUsers = users.map(user => ({
            numero_de_usuario: user.id,
            nombre: user.nombre,
            correo: user.email,
        }));

        res.json(transformedUsers); 
    } catch (err) {
        console.error('Error al obtener todos los usuarios:', err);
        res.status(500).json({ error: 'Error al obtener todos los usuarios' });
    }
}

// Obtener un usuario por ID
async function getUserById(req, res) {
    const { id } = req.params;
    try {
        const user = await usersDao.getById(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error al obtener el usuario:', err);
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
}

// Registrar un usuario
async function registerUser(req, res) {
    const { nombre, email, password } = req.body;
    try {
        const userId = await usersDao.insert({ nombre, email, password });
        res.status(201).json({ message: 'Usuario registrado con éxito', userId });
    } catch (err) {
        console.error('Error al registrar usuario:', err);
        res.status(500).json({ error: err.message });
    }
}

// Actualizar un usuario
async function updateUser(req, res) {
    const { id } = req.params;
    const { nombre, email } = req.body;

    try {
        const affectedRows = await usersDao.update(id, { nombre, email });
        if (affectedRows > 0) {
            res.json({ message: 'Usuario actualizado exitosamente' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (err) {
        console.error('Error al actualizar el usuario:', err);
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
}

module.exports = {
    getUsers,        
    getAllPublico,   
    getUserById,
    registerUser,
    updateUser
};
