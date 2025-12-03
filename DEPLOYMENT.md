# 🚀 Guía de Deployment Gratuito - Mi Pedacito de Ti

Esta guía te ayudará a desplegar tu aplicación completamente gratis usando servicios en la nube.

## 📋 Resumen de Servicios

- **Backend**: Railway o Render (Node.js + Socket.io)
- **Frontend**: Vercel o Netlify (React)
- **Base de Datos**: MongoDB Atlas (ya configurado)
- **Almacenamiento de Imágenes**: Cloudinary (opcional, actualmente usa local)

---

## 🗄️ 1. MongoDB Atlas (Ya Configurado ✅)

Tu base de datos ya está lista en MongoDB Atlas:
- **Cluster**: Cluster0
- **Usuario**: leomos_db_user
- **Base de datos**: mipedacito
- **Tier**: M0 Free (512MB storage)

No necesitas hacer nada más aquí.

---

## 🖥️ 2. Backend en Railway (Opción 1 - Recomendado)

Railway ofrece 500 horas gratis por mes y es muy fácil de usar.

### Pasos:

1. **Crear cuenta en Railway**
   - Ve a https://railway.app
   - Registrate con tu cuenta de GitHub

2. **Crear nuevo proyecto**
   - Click en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Autoriza Railway para acceder a tu repositorio (primero súbelo a GitHub)

3. **Configurar variables de entorno**
   
   En el dashboard de Railway, ve a "Variables" y agrega:

   ```env
   NODE_ENV=production
   PORT=5001
   MONGODB_URI=mongodb+srv://leomos_db_user:Californication45$@cluster0.wcgr3jq.mongodb.net/mipedacito
   JWT_SECRET=tu-secreto-super-seguro-cambiar-en-produccion
   FRONTEND_URL=https://tu-frontend.vercel.app
   
   # Opcional - Cloudinary para imágenes
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   ```

4. **Deploy**
   - Railway detectará automáticamente que es una app Node.js
   - El deploy se iniciará automáticamente
   - Copia la URL que te da Railway (ej: `https://tu-app.railway.app`)

---

## 🖥️ 2B. Backend en Render (Opción 2 - Alternativa)

Render ofrece 750 horas gratis por mes pero el servicio se "duerme" si no se usa.

### Pasos:

1. **Crear cuenta en Render**
   - Ve a https://render.com
   - Registrate con GitHub

2. **Crear nuevo Web Service**
   - Click en "New +" → "Web Service"
   - Conecta tu repositorio de GitHub
   - Selecciona el repositorio de tu backend

3. **Configuración**
   ```
   Name: mi-pedacito-backend
   Region: Oregon (US West) - más cercano
   Branch: main
   Root Directory: mi-pedacito-backend
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   Instance Type: Free
   ```

4. **Variables de entorno**
   
   Mismo que Railway (arriba)

5. **Deploy**
   - Click en "Create Web Service"
   - Espera 5-10 minutos para el primer deploy
   - Copia la URL (ej: `https://tu-app.onrender.com`)

---

## 🌐 3. Frontend en Vercel (Opción 1 - Recomendado)

Vercel es perfecto para React y ofrece deploys ilimitados gratis.

### Pasos:

1. **Crear cuenta en Vercel**
   - Ve a https://vercel.com
   - Registrate con GitHub

2. **Importar proyecto**
   - Click en "Add New..." → "Project"
   - Selecciona tu repositorio
   - Vercel detectará automáticamente que es una app React

3. **Configuración**
   ```
   Framework Preset: Create React App
   Root Directory: mi-pedacito-frontend
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

4. **Variables de entorno**
   
   En "Environment Variables":
   ```env
   REACT_APP_API_URL=https://tu-backend.railway.app
   REACT_APP_SOCKET_URL=https://tu-backend.railway.app
   ```

5. **Deploy**
   - Click en "Deploy"
   - En 2-3 minutos tendrás tu app lista
   - Tu URL será algo como `https://tu-app.vercel.app`

6. **Actualizar Backend**
   
   Vuelve a Railway/Render y actualiza la variable:
   ```env
   FRONTEND_URL=https://tu-app.vercel.app
   ```

---

## 🌐 3B. Frontend en Netlify (Opción 2 - Alternativa)

Netlify también es excelente para React y ofrece deploys ilimitados gratis.

### Pasos:

1. **Crear cuenta en Netlify**
   - Ve a https://netlify.com
   - Registrate con GitHub

2. **Nuevo sitio desde Git**
   - Click en "Add new site" → "Import an existing project"
   - Conecta con GitHub y selecciona tu repo

3. **Configuración**
   ```
   Base directory: mi-pedacito-frontend
   Build command: npm run build
   Publish directory: mi-pedacito-frontend/build
   ```

4. **Variables de entorno**
   
   En "Site settings" → "Environment variables":
   ```env
   REACT_APP_API_URL=https://tu-backend.railway.app
   REACT_APP_SOCKET_URL=https://tu-backend.railway.app
   ```

5. **Deploy**
   - Click en "Deploy site"
   - Tu URL será `https://tu-app.netlify.app`

---

## 📷 4. Cloudinary para Imágenes (Opcional)

Actualmente la app usa almacenamiento local, pero para producción se recomienda Cloudinary.

### Pasos:

1. **Crear cuenta en Cloudinary**
   - Ve a https://cloudinary.com
   - Plan gratis: 25 GB storage, 25 GB bandwidth/mes

2. **Obtener credenciales**
   - En el dashboard verás:
     - Cloud name
     - API Key
     - API Secret

3. **Agregar al backend**
   
   En Railway/Render, agrega estas variables:
   ```env
   CLOUDINARY_CLOUD_NAME=tu-cloud-name
   CLOUDINARY_API_KEY=tu-api-key
   CLOUDINARY_API_SECRET=tu-api-secret
   ```

4. **Redeploy**
   - El backend automáticamente usará Cloudinary
   - Las imágenes se subirán a la nube en lugar de local

---

## ✅ 5. Verificación Post-Deployment

### Checklist:

1. **Backend funcionando**
   ```bash
   curl https://tu-backend.railway.app/health
   # Debe responder: {"status":"ok","message":"Server is running"}
   ```

2. **Frontend cargando**
   - Abre `https://tu-app.vercel.app`
   - Deberías ver la página de login

3. **Socket.io conectado**
   - Inicia sesión en el frontend
   - En la consola del navegador (F12) no debe haber errores de Socket.io
   - El header debe mostrar "🟢 Conectado"

4. **Subir foto**
   - Sube una foto de prueba
   - Verifica que se guarde correctamente
   - Si usas Cloudinary, la URL debe contener "cloudinary.com"

5. **Together Mode**
   - Prueba con dos dispositivos
   - El audio debe transmitirse en tiempo real

---

## 🔒 6. Seguridad para Producción

### ⚠️ IMPORTANTE - Antes de hacer público:

1. **Cambiar JWT_SECRET**
   ```env
   JWT_SECRET=un-secreto-muy-largo-y-aleatorio-de-al-menos-32-caracteres
   ```
   
   Genera uno seguro:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Cambiar contraseña de MongoDB**
   - En MongoDB Atlas, ve a "Database Access"
   - Cambia la contraseña de `leomos_db_user`
   - Actualiza `MONGODB_URI` en el backend

3. **Configurar CORS**
   - Ya está configurado en `mi-pedacito-backend/src/app.ts`
   - Verifica que `FRONTEND_URL` sea correcto

4. **HTTPS**
   - Vercel, Netlify, Railway y Render incluyen HTTPS gratis ✅
   - No necesitas hacer nada

---

## 💰 Resumen de Costos

### Plan Gratuito Ilimitado:

| Servicio | Límite Gratis | Suficiente para |
|----------|---------------|-----------------|
| **MongoDB Atlas** | 512 MB | ~10,000 fotos metadata |
| **Railway** | 500 horas/mes | 24/7 (con sleep) |
| **Vercel** | Deploys ilimitados | ∞ usuarios |
| **Cloudinary** | 25 GB/mes | ~5,000 fotos |

**Total: $0/mes** para uso personal (2 usuarios)

---

## 🆘 Troubleshooting

### Problema: "Socket.io not connecting"

**Solución:**
1. Verifica que `REACT_APP_SOCKET_URL` esté correcto en Vercel
2. Asegúrate que el backend esté corriendo (visita `/health`)
3. Revisa los logs en Railway/Render

### Problema: "Cannot upload photos"

**Solución:**
1. Si usas Cloudinary, verifica las credenciales
2. Si usas almacenamiento local, no funcionará en Railway/Render (usa Cloudinary)

### Problema: "MongoDB connection failed"

**Solución:**
1. Verifica que `MONGODB_URI` esté correcto
2. En MongoDB Atlas, ve a "Network Access" y agrega `0.0.0.0/0` (permitir todo)

### Problema: "Railway se queda sin horas"

**Solución:**
1. Railway reinicia las horas cada mes
2. Alternativa: usa Render (750 horas/mes)
3. O agrega tarjeta de crédito en Railway ($5 de crédito gratis)

---

## 📝 Próximos Pasos

Una vez desplegado:

1. **Dominio personalizado** (opcional)
   - Vercel y Netlify permiten dominios custom gratis
   - Compra un dominio en Namecheap (~$10/año)

2. **PWA en móvil**
   - La app ya es PWA
   - En Chrome móvil: "Add to Home Screen"
   - Se comportará como app nativa

3. **Notificaciones push** (futuro)
   - Requiere Service Workers
   - Firebase Cloud Messaging (gratis)

---

## 🎉 ¡Listo!

Tu app "Mi Pedacito de Ti" está ahora en la nube, accesible desde cualquier lugar del mundo, completamente gratis.

**URLs finales:**
- Frontend: `https://tu-app.vercel.app`
- Backend: `https://tu-backend.railway.app`
- Database: MongoDB Atlas (cloud)

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Railway/Render dashboard
2. Revisa la consola del navegador (F12)
3. Los servicios tienen documentación excelente:
   - [Railway Docs](https://docs.railway.app)
   - [Render Docs](https://render.com/docs)
   - [Vercel Docs](https://vercel.com/docs)
   - [Netlify Docs](https://docs.netlify.com)

---

**¡Disfruten su app! 💝🚛✨**
