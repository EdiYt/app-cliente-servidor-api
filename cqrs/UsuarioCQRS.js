const usersDao = require('../dao/UsuarioDAO');

class CQRSUsuario {
    // Comando para registrar un usuario
    async register(nombre, email, password) {
        if (!nombre || nombre.length < 3 || nombre.length > 50) {
            throw new Error('El nombre debe tener entre 3 y 50 caracteres.');
        }

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            throw new Error('El correo electrónico no es válido.');
        }

        const userId = await usersDao.insert({ nombre, email, password });
        return userId;
    }

    // Comando para actualizar un usuario
    async update(id, nombre, email) {
        if (!nombre || nombre.length < 3 || nombre.length > 50) {
            throw new Error('El nombre debe tener entre 3 y 50 caracteres.');
        }

        const affectedRows = await usersDao.update(id, { nombre, email });
        if (affectedRows === 0) {
            throw new Error('No se encontró el usuario para actualizar.');
        }

        return affectedRows;
    }

    // Consulta para obtener todos los usuarios
    async getAllUsers() {
        return await usersDao.getAll();
    }

    // Consulta para obtener un usuario por su ID
    async getUserById(id) {
        return await usersDao.getById(id);
    }
}

module.exports = CQRSUsuario;
