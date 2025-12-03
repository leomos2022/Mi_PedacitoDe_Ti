# 💕 Mi Pedacito de Ti - Guía de Setup Completa

¡Felicidades! Tienes el código completo para la aplicación "Mi Pedacito de Ti" para Oscar. 

## 📁 Estructura del Proyecto

```
together/
├── mi-pedacito-backend/     # Backend (Node.js + Express + Socket.io)
└── mi-pedacito-frontend/    # Frontend (React + TypeScript + Tailwind)
```

## 🚀 Pasos para Ejecutar Localmente

### 1️⃣ Configurar Backend

```bash
cd mi-pedacito-backend

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
# MongoDB Atlas (FREE)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mipedacito

# JWT Secret (genera uno aleatorio)
JWT_SECRET=tu_clave_super_secreta_muy_larga_y_random

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Cloudinary (FREE) - Para almacenar fotos/audio
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

PORT=5000
```

**Obtener credenciales:**

- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas (100% gratis)
- **Cloudinary**: https://cloudinary.com (gratis hasta 25GB)

```bash
# Ejecutar backend
npm run dev
```

El backend estará en: http://localhost:5000

### 2️⃣ Configurar Frontend

```bash
cd mi-pedacito-frontend

# Ya se instalaron las dependencias durante la creación

# Crear archivo .env
cp .env.example .env
```

Edita `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

```bash
# Ejecutar frontend
npm start
```

El frontend estará en: http://localhost:3000

## 🌐 Deploy a Producción (GRATIS)

### Backend en Railway

1. Crear cuenta en [Railway.app](https://railway.app)
2. Instalar CLI:
   ```bash
   npm i -g @railway/cli
   ```
3. Login y deploy:
   ```bash
   cd mi-pedacito-backend
   railway login
   railway init
   railway up
   ```
4. Configurar variables de entorno en el dashboard de Railway
5. Copiar la URL del backend (ej: `https://tu-app.railway.app`)

### Frontend en Vercel

1. Crear cuenta en [Vercel](https://vercel.com)
2. Instalar CLI:
   ```bash
   npm i -g vercel
   ```
3. Deploy:
   ```bash
   cd mi-pedacito-frontend
   vercel --prod
   ```
4. Configurar variables de entorno:
   - `REACT_APP_API_URL`: `https://tu-backend.railway.app/api`
   - `REACT_APP_SOCKET_URL`: `https://tu-backend.railway.app`

## 📱 Configurar como PWA en Móvil

### En iPhone:
1. Abrir en Safari
2. Tocar el botón "Compartir"
3. Seleccionar "Agregar a pantalla de inicio"

### En Android:
1. Abrir en Chrome
2. Tocar menú (⋮)
3. Seleccionar "Agregar a pantalla de inicio"

## 🎯 Funcionalidades Implementadas

✅ **Autenticación segura** (máximo 2 usuarios)
✅ **Together Mode** - Audio streaming en tiempo real
✅ **Galería de fotos** compartidas
✅ **Subida de fotos** con preview
✅ **Categorización** de momentos (desayuno, comida, cena, etc.)
✅ **Socket.io** para comunicación en tiempo real
✅ **Notificaciones** de nuevas fotos
✅ **Estado online/offline** de la pareja
✅ **Diseño responsive** (móvil first)
✅ **PWA** (instalable como app)
✅ **Optimizaciones** para conexiones limitadas

## 📋 Próximos Pasos (Opcional)

Puedes agregar estas funcionalidades adicionales:

1. **Memory Lane** (fotos programadas)
   - Ya está el backend preparado
   - Solo falta crear el componente en frontend

2. **Mensajes de Voz**
   - Backend listo
   - Crear componente VoiceRecorder

3. **Sunset Sync** (notificaciones sincronizadas)
   - Utilidad ya creada en backend
   - Implementar lógica de notificaciones

4. **Modo Conducción** para Oscar
   - UI simplificada
   - Comandos por voz

## 🔧 Scripts Útiles

### Backend
```bash
npm run dev      # Desarrollo con hot-reload
npm run build    # Compilar TypeScript
npm start        # Producción
```

### Frontend
```bash
npm start        # Desarrollo
npm run build    # Build para producción
npm test         # Tests
```

## 🐛 Troubleshooting

### Error: "Cannot connect to MongoDB"
- Verifica que la URI de MongoDB sea correcta
- Asegúrate de que tu IP esté en la whitelist de MongoDB Atlas

### Error: "CORS blocked"
- Verifica que `FRONTEND_URL` en backend coincida con la URL del frontend
- En producción, usa las URLs HTTPS completas

### Error: "Token invalid"
- Limpia localStorage en el navegador
- Vuelve a hacer login

### Audio no funciona en Together Mode
- Asegura que el navegador tenga permisos de micrófono
- En iOS Safari, puede requerir interacción del usuario primero

## 💡 Tips para Oscar (Truck Driver)

1. **Datos móviles**: Las fotos se comprimen automáticamente al 70%
2. **Conexión limitada**: La app funciona en segundo plano
3. **Seguridad**: No usar mientras conduces - usa el modo de solo lectura
4. **Batería**: El Together Mode consume batería, úsalo con cargador

## 📞 Soporte

Si encuentras problemas, revisa:
1. Logs del backend: `railway logs` o consola local
2. Consola del navegador (F12)
3. README.md de cada carpeta para más detalles

## 🎁 Mensaje Especial

Esta app fue creada con mucho amor para mantenerlos conectados sin importar la distancia.

**¡Disfruten cada momento juntos!** 💕

---

**Creado con ❤️ para Oscar y su persona especial**
