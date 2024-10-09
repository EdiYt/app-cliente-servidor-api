const mysql = require('mysql2');

// Conexión para la base de datos de login
const loginDB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456', // Cambia la contraseña si es necesario
    database: 'login_db'
});

// Conexión para la base de datos de libros
const booksDB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456', // Cambia la contraseña si es necesario
    database: 'modulo_libros'
});

// Conexión a ambas bases de datos junto con sus errores
loginDB.connect(err => {
    if (err) {
        console.error('Error connecting to login_db:', err);
        return;
    }
    console.log('Connected to login_db');
});

booksDB.connect(err => {
    if (err) {
        console.error('Error connecting to modulo_libros:', err);
        return;
    }
    console.log('Connected to modulo_libros');
});

module.exports = { loginDB, booksDB };