const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);

// Se inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
