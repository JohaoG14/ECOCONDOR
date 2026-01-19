require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const recyclingRoutes = require('./routes/recycling.routes');
const rewardsRoutes = require('./routes/rewards.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/recycling', recyclingRoutes);
app.use('/api/rewards', rewardsRoutes);

// Ruta de health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'ECOCONDOR API funcionando correctamente',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        name: 'ECOCONDOR API',
        description: 'Backend para plataforma de reciclaje',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth',
            recycling: '/api/recycling',
            rewards: '/api/rewards'
        }
    });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint no encontrado'
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════╗
║     🌿 ECOCONDOR API Server                   ║
║     Puerto: ${PORT}                              ║
║     Ambiente: ${process.env.NODE_ENV || 'development'}                   ║
╚════════════════════════════════════════════════╝
  `);
});

module.exports = app;
