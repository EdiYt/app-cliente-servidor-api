const mysql = require('mysql2/promise');

// Conexión a la base de datos
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'biblioteca_db' 
});

module.exports = db;