const booksDao = require('../dao/booksDao');

class CQRSLibro {
    async insert(nombre, autor, genero, pdfUrl) {
        // Validaciones de el nombre y genero del libro
        if (!nombre || nombre.length < 5 || nombre.length > 100) {
            throw new Error('El nombre del libro debe tener entre 5 y 100 caracteres.');
        }

        if (!genero || genero.length < 5 || genero.length > 30) {
            throw new Error('El género del libro debe tener entre 5 y 30 caracteres.');
        }

        // Llamo al dao para insertar el libro
        const newBookId = await booksDao.insert({
            nombre,
            autor,
            genero,
            pdf_path: pdfUrl
        });

        return newBookId;
    }

    async update(id, nombre, autor, genero, estatus) {
        // Validaciones de el nombre y genero del libro pero en lo de actualizar
        if (!nombre || nombre.length < 5 || nombre.length > 100) {
            throw new Error('El nombre del libro debe tener entre 5 y 100 caracteres.');
        }

        if (!genero || genero.length < 5 || genero.length > 30) {
            throw new Error('El género del libro debe tener entre 5 y 30 caracteres.');
        }

        // Llamado al dao para actualizacion
        const affectedRows = await booksDao.update(id, {
            nombre,
            autor,
            genero,
            estatus
        });

        if (affectedRows === 0) {
            throw new Error('No se encontró el libro para actualizar.');
        }

        return affectedRows;
    }
}

module.exports = CQRSLibro;