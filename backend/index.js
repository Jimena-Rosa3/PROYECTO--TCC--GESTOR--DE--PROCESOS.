require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware para leer JSON
app.use(express.json());

const cors = require('cors');

// Configurar CORS para permitir el acceso desde tu frontend
app.use(cors({
  origin: 'http://localhost:3000', // tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Importar el modelo y las rutas
const userRoutes = require('./routes/userRoutes');

// Usar las rutas
app.use('/api', userRoutes);


// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error(' Error conectando a MongoDB:', err));

// Ruta principal
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente ');
});

// Middleware global de manejo de errores
const errorHandler = require('./middleware/errorMiddleware');
app.use(errorHandler);


// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



