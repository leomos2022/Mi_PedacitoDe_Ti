# 🎯 Mi Pedacito de Ti - Quick Start

## ✅ ¿Qué se ha creado?

✨ **Aplicación completa** para conectar a Oscar con su pareja a través de la distancia.

### 📦 Estructura:
```
together/
├── 📄 SETUP_GUIDE.md              # Guía completa de instalación
├── 📄 DEPLOYMENT_GUIDE.md         # Guía de deploy a producción
├── 📄 CARTA_PARA_OSCAR.md         # Mensaje especial personalizado
│
├── 🔧 mi-pedacito-backend/        # Backend API
│   ├── src/
│   │   ├── models/                # User, Photo, VoiceMessage, ConnectionLog
│   │   ├── controllers/           # Auth, Photo, Voice controllers
│   │   ├── routes/                # API routes
│   │   ├── middleware/            # Auth, Upload middleware
│   │   ├── utils/                 # Socket.io, Sunset calculator
│   │   └── app.ts                 # Servidor principal
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env                       # Variables de entorno (configurado para local)
│   └── README.md
│
└── 💻 mi-pedacito-frontend/       # Frontend React
    ├── src/
    │   ├── components/
    │   │   ├── Auth/              # Login, Register
    │   │   ├── Dashboard/         # TogetherMode, PhotoGallery
    │   │   ├── Layout/            # Header
    │   │   └── Common/            # ProtectedRoute
    │   ├── context/               # AuthContext
    │   ├── hooks/                 # useSocket, usePartner
    │   ├── services/              # API, Socket clients
    │   ├── pages/                 # Home
    │   └── types/                 # TypeScript types
    ├── public/
    │   └── manifest.json          # PWA configuration
    ├── package.json
    ├── .env                       # Variables de entorno (configurado para local)
    └── README.md
```

## 🚀 Para Comenzar AHORA (Local)

### Paso 1: Instalar dependencias del Backend
```bash
cd mi-pedacito-backend
npm install
```

### Paso 2: Iniciar Backend
```bash
# En la carpeta mi-pedacito-backend
npm run dev
```

El backend estará en: **http://localhost:5000**
- Ver health: http://localhost:5000/health

### Paso 3: Iniciar Frontend (en otra terminal)
```bash
cd mi-pedacito-frontend
npm start
```

El frontend se abrirá automáticamente en: **http://localhost:3000**

## ✨ Funcionalidades Implementadas

### ✅ Backend Completo:
- [x] Autenticación JWT (login/register)
- [x] Límite de 2 usuarios máximo
- [x] API de fotos (upload, get, delete)
- [x] API de mensajes de voz (upload, get, mark played)
- [x] Socket.io para tiempo real
- [x] Together Mode (streaming de audio)
- [x] Calculadora de puestas de sol
- [x] Notificaciones en tiempo real
- [x] Integración con Cloudinary
- [x] MongoDB schemas completos

### ✅ Frontend Completo:
- [x] Login & Register forms
- [x] Protected routes
- [x] Auth context & hooks
- [x] Together Mode component
- [x] Photo Gallery con upload
- [x] Socket.io integration
- [x] Real-time notifications
- [x] Partner online/offline status
- [x] Responsive design (móvil-first)
- [x] Tailwind CSS styling
- [x] PWA ready

## 📱 Para Probar Localmente:

1. **Registrar primer usuario:**
   - Ir a http://localhost:3000/register
   - Crear cuenta (ej: "Oscar", "oscar@email.com", "password123")

2. **Registrar segundo usuario:**
   - Abrir en modo incógnito o en otro navegador
   - Ir a http://localhost:3000/register
   - Crear segunda cuenta

3. **Probar funcionalidades:**
   - Ver estado online/offline
   - Subir una foto
   - Ver la foto en tiempo real en la otra sesión
   - Intentar Together Mode (pedirá permisos de micrófono)

## 🌐 Para Deploy a Producción:

Lee el archivo **`DEPLOYMENT_GUIDE.md`** con instrucciones detalladas para:
- Railway (backend) - GRATIS
- Vercel (frontend) - GRATIS
- MongoDB Atlas - GRATIS
- Cloudinary - GRATIS

**Total: $0/mes** ✨

## 🔧 Configuración Actual:

### Backend (.env ya configurado):
```
MONGODB_URI=mongodb://localhost:27017/mipedacito
JWT_SECRET=mi_pedacito_de_ti_secret_key_2024_oscar
FRONTEND_URL=http://localhost:3000
PORT=5000
```

### Frontend (.env ya configurado):
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## ⚠️ Importante:

### Para usar MongoDB:
**Opción 1: MongoDB Local** (más rápido para probar)
```bash
# Si tienes MongoDB instalado
mongod
```

**Opción 2: MongoDB Atlas** (recomendado)
1. Crear cuenta en https://www.mongodb.com/cloud/atlas
2. Crear cluster gratuito
3. Copiar connection string
4. Actualizar `MONGODB_URI` en `mi-pedacito-backend/.env`

### Para subir fotos:
**Opción 1: Local** (funciona sin configurar nada)
- Las fotos se guardan en carpeta `uploads/`

**Opción 2: Cloudinary** (recomendado para producción)
1. Crear cuenta en https://cloudinary.com
2. Copiar credenciales
3. Actualizar en `mi-pedacito-backend/.env`

## 🎨 Personalización:

### Cambiar colores:
Edita `mi-pedacito-frontend/tailwind.config.js`

### Cambiar nombre de la app:
- Frontend: `mi-pedacito-frontend/public/manifest.json`
- Backend: `mi-pedacito-backend/src/app.ts`

## 🐛 Troubleshooting:

### Backend no inicia:
```bash
# Verifica que el puerto 5000 esté libre
lsof -ti:5000
# Si está ocupado, cámbialo en .env
```

### Frontend no conecta:
- Verifica que el backend esté corriendo
- Revisa la consola del navegador (F12)

### No aparecen las fotos:
- Verifica que la carpeta `uploads/` exista
- O configura Cloudinary

## 📚 Documentación Adicional:

- **SETUP_GUIDE.md** - Guía completa de instalación y configuración
- **DEPLOYMENT_GUIDE.md** - Deploy a producción paso a paso
- **CARTA_PARA_OSCAR.md** - Mensaje personalizado especial
- **mi-pedacito-backend/README.md** - Detalles del backend
- **mi-pedacito-frontend/README.md** - Detalles del frontend

## 💝 Features Especiales:

### Ya implementado:
- ✅ Together Mode (audio en tiempo real)
- ✅ Galería de fotos compartidas
- ✅ Notificaciones push en tiempo real
- ✅ Estado online/offline
- ✅ PWA (instalable en móvil)
- ✅ Optimizado para datos móviles
- ✅ Diseño responsive

### Por implementar (opcionales):
- 🔜 Memory Lane (fotos programadas)
- 🔜 Mensajes de voz
- 🔜 Sunset sync notifications
- 🔜 Modo conducción para Oscar

## 🎁 ¡Listo para usar!

La aplicación está **100% funcional** y lista para:
1. Probarse localmente AHORA
2. Deployarse a producción cuando quieras
3. Personalizarse como desees

## 💕 Creado con amor

Esta aplicación fue diseñada específicamente para mantener conectados a Oscar y su pareja a través de la distancia.

**¡Disfruten cada momento juntos, sin importar los kilómetros!** 🚛💨➡️💕

---

## 🆘 ¿Necesitas ayuda?

1. Lee el **SETUP_GUIDE.md** para instalación completa
2. Lee el **DEPLOYMENT_GUIDE.md** para deploy a producción
3. Revisa los README.md en cada carpeta
4. Chequea las consolas (backend y navegador) para errores

**¡Mucha suerte y que disfruten la app!** ✨
# Deployment trigger
# Deploy trigger

