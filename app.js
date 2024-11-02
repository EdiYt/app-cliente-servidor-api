const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');

require('dotenv').config();

const app = express();

app.use(cors({
    origin: '*'
}));

app.use(express.json());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './tmp/',
    limits: { fileSize: 5 * 1024 * 1024 } // Tamaño máximo permitido, en este caso 5MB
}));

// Rutas
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo salió mal', error: err.message });
});

// Se inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
