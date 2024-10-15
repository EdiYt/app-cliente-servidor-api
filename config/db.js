const mysql = require('mysql2/promise');
const mysql1 = require('mysql2');

// Conexión para la base de datos de login
const loginDB = mysql1.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456', 
    database: 'login_db'
});

// Conexión para la base de datos de libros
const booksDB = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456', 
    database: 'modulo_libros'
});



module.exports = { loginDB, booksDB };