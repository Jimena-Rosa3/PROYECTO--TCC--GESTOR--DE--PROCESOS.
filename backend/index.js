require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();

// === Importar rutas ===
const userRoutes = require('./routes/userRoutes');
const procesoRoutes = require('./routes/procesosRoutes');
const reportesRoutes = require('./routes/reportesRoutes');

// === Middlewares globales ===
app.use(express.json());

// === Configurar CORS ===
app.use(cors({
  origin: 'http://localhost:3000', // URL del frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// === Servir archivos estáticos (por ejemplo, imágenes de reportes) ===
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// === Usar rutas principales ===
// Autenticación y usuarios (login, registro, gestión)
app.use('/api', userRoutes);

// Procesos (crear, aprobar, rechazar)
app.use('/api/procesos', procesoRoutes);

// Reportes de incidencias (crear, listar, aprobar, rechazar)
app.use('/api/reportes', reportesRoutes);

// === Conexión a MongoDB Atlas ===
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

// === Ruta raíz de prueba ===
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente - Backend ProcessControl');
});

// === Middleware global de manejo de errores ===
const errorHandler = require('./middleware/errorMiddleware');
app.use(errorHandler);

// === Iniciar servidor ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`⚡ Servidor corriendo en http://localhost:${PORT}`);
});