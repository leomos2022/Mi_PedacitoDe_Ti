import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Importar rutas
import authRoutes from './routes/auth';
import photoRoutes from './routes/photos';
import voiceRoutes from './routes/voice';

// Importar utilidades
import { initializeSocket } from './utils/socket';

// Cargar variables de entorno
dotenv.config();

// Crear app Express
const app = express();
const server = http.createServer(app);

// Inicializar Socket.io
const io = initializeSocket(server);

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'https://mi-pedacito-de-ti.netlify.app',
  /https:\/\/.*--mi-pedacito-de-ti\.netlify\.app$/ // Permite preview deploys de Netlify
];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (como mobile apps o curl)
    if (!origin) return callback(null, true);
    
    // Verificar si el origin está permitido
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return allowedOrigin === origin;
      }
      // Si es una RegExp, probar el patrón
      return allowedOrigin.test(origin);
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Crear carpeta uploads si no existe
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Servir archivos estáticos desde uploads
app.use('/uploads', express.static(uploadsDir));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/voice', voiceRoutes);

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Mi Pedacito de Ti API está funcionando 💕',
    timestamp: new Date().toISOString(),
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: '💞 Bienvenido a Mi Pedacito de Ti API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      photos: '/api/photos',
      voice: '/api/voice',
      health: '/health',
    },
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
  });
});

// Conectar a MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mipedacito';
    
    await mongoose.connect(mongoURI);
    
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

// Iniciar servidor
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  
  server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    console.log(`💕 Mi Pedacito de Ti está listo para conectar corazones`);
  });
};

// Manejo de señales de terminación
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT recibido, cerrando servidor...');
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});

// Iniciar
startServer();

export default app;
