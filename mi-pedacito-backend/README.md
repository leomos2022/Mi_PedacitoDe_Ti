# Mi Pedacito de Ti - Backend 💕

Backend API para "Mi Pedacito de Ti", una aplicación de conexión en tiempo real para parejas a distancia.

## 🚀 Features

- ✅ Autenticación segura (JWT) - Máximo 2 usuarios
- 💞 Together Mode - Streaming de audio en tiempo real
- 📸 Galería de fotos compartidas
- 🎤 Mensajes de voz
- 🌅 Sincronización de atardeceres
- 💾 Memory Lane - Fotos programadas

## 🛠 Stack Tecnológico

- Node.js + Express + TypeScript
- MongoDB + Mongoose
- Socket.io (comunicación en tiempo real)
- Cloudinary (almacenamiento de archivos)
- JWT (autenticación)

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Editar .env con tus credenciales
```

## 🔧 Configuración

Crea un archivo `.env` con las siguientes variables:

```env
MONGODB_URI=tu_mongodb_uri
JWT_SECRET=tu_clave_secreta
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
PORT=5000
```

### MongoDB Atlas (Gratis)
1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear cluster gratuito
3. Obtener connection string
4. Agregar IP address whitelist

### Cloudinary (Gratis)
1. Crear cuenta en [Cloudinary](https://cloudinary.com/)
2. Obtener credenciales del dashboard
3. Configurar en .env

## 🏃‍♂️ Ejecutar

```bash
# Desarrollo con hot-reload
npm run dev

# Producción
npm run build
npm start
```

## 📡 Endpoints API

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil (protegido)
- `PUT /api/auth/location` - Actualizar ubicación (protegido)
- `GET /api/auth/partner` - Obtener info de pareja (protegido)

### Fotos
- `POST /api/photos/upload` - Subir foto (protegido)
- `GET /api/photos` - Obtener todas las fotos (protegido)
- `GET /api/photos/memory-lane` - Fotos del día (protegido)
- `GET /api/photos/meal/:mealType` - Fotos por tipo de comida (protegido)
- `DELETE /api/photos/:photoId` - Eliminar foto (protegido)

### Mensajes de Voz
- `POST /api/voice/upload` - Subir mensaje (protegido)
- `GET /api/voice` - Obtener mensajes (protegido)
- `GET /api/voice/unplayed` - Mensajes no reproducidos (protegido)
- `PUT /api/voice/:messageId/played` - Marcar como reproducido (protegido)
- `DELETE /api/voice/:messageId` - Eliminar mensaje (protegido)

## 🔌 Socket.io Events

### Cliente → Servidor
- `join` - Usuario se conecta
- `audio-stream` - Enviar audio en tiempo real
- `start-together-mode` - Iniciar modo juntos
- `accept-together-mode` - Aceptar conexión
- `end-together-mode` - Finalizar modo juntos
- `new-photo` - Notificar nueva foto
- `new-voice-message` - Notificar nuevo mensaje
- `typing` - Usuario escribiendo
- `sunset-time` - Compartir hora de atardecer

### Servidor → Cliente
- `partner-online` - Pareja conectada
- `partner-offline` - Pareja desconectada
- `incoming-audio` - Audio entrante
- `together-mode-request` - Solicitud de conexión
- `together-mode-accepted` - Conexión aceptada
- `together-mode-ended` - Conexión terminada
- `photo-uploaded` - Nueva foto disponible
- `voice-message-received` - Nuevo mensaje de voz
- `partner-typing` - Pareja escribiendo
- `partner-sunset` - Hora de atardecer de pareja
- `check-sunset` - Verificar atardecer

## 🚀 Deploy

### Railway (Recomendado)
```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Iniciar proyecto
railway init

# Deploy
railway up
```

### Render
1. Conectar repositorio de GitHub
2. Configurar variables de entorno
3. Deploy automático

### Variables de entorno en producción
Asegúrate de configurar todas las variables en tu plataforma de deploy.

## 📱 Optimizaciones para Móviles

- Compresión de imágenes al 70%
- Thumbnails de 300x300px
- Audio en formato MP3
- Límite de archivos: 10MB
- Lazy loading

## 🔒 Seguridad

- Máximo 2 usuarios en toda la app
- Tokens JWT con expiración de 30 días
- Passwords hasheados con bcrypt
- CORS configurado
- Validación de tipos de archivo

## 📝 Licencia

Creado con ❤️ para Oscar

---

**Nota:** Este proyecto fue diseñado específicamente para conectar a dos personas especiales a través de la distancia. 💕
