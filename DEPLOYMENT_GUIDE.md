# 🚀 Guía de Deployment - Mi Pedacito de Ti

## Opciones de Deployment (100% GRATIS)

### Opción 1: Railway + Vercel (Recomendado)

**Ventajas:**
- ✅ Completamente gratis
- ✅ Deploy automático desde Git
- ✅ SSL incluido
- ✅ Muy fácil de configurar

#### Backend en Railway

1. **Crear cuenta**: https://railway.app (con GitHub)

2. **Instalar Railway CLI** (opcional):
   ```bash
   npm install -g @railway/cli
   ```

3. **Deploy vía Dashboard** (más fácil):
   - Click "New Project"
   - Click "Deploy from GitHub repo"
   - Selecciona el repositorio
   - Railway detectará automáticamente Node.js
   - Selecciona la carpeta `mi-pedacito-backend`

4. **Configurar Variables de Entorno** en Railway Dashboard:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=tu_clave_secreta
   FRONTEND_URL=https://tu-app.vercel.app
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   PORT=5000
   ```

5. **Obtener URL del backend**: `https://tu-app.up.railway.app`

#### Frontend en Vercel

1. **Crear cuenta**: https://vercel.com (con GitHub)

2. **Import desde GitHub**:
   - Click "New Project"
   - Import tu repositorio
   - Framework Preset: Create React App
   - Root Directory: `mi-pedacito-frontend`

3. **Configurar Variables de Entorno**:
   ```
   REACT_APP_API_URL=https://tu-backend.up.railway.app/api
   REACT_APP_SOCKET_URL=https://tu-backend.up.railway.app
   ```

4. **Deploy**: Vercel hace deploy automáticamente

5. **Obtener URL**: `https://tu-app.vercel.app`

### Opción 2: Render (Todo en uno)

**Backend y Frontend en Render:**

1. **Crear cuenta**: https://render.com

2. **Deploy Backend**:
   - New → Web Service
   - Connect GitHub repo
   - Root Directory: `mi-pedacito-backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: Free
   - Agregar variables de entorno

3. **Deploy Frontend**:
   - New → Static Site
   - Connect GitHub repo
   - Root Directory: `mi-pedacito-frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`

### Opción 3: Heroku (Alternativa)

**Backend:**
```bash
cd mi-pedacito-backend
heroku create mi-pedacito-backend
heroku config:set MONGODB_URI=...
heroku config:set JWT_SECRET=...
git push heroku main
```

**Frontend:**
```bash
cd mi-pedacito-frontend
heroku create mi-pedacito-frontend
heroku config:set REACT_APP_API_URL=...
git push heroku main
```

## 📦 Servicios Externos Necesarios

### 1. MongoDB Atlas (Base de Datos - GRATIS)

1. **Crear cuenta**: https://www.mongodb.com/cloud/atlas
2. **Crear Cluster**: 
   - Shared (FREE)
   - Provider: AWS
   - Region: Más cercana a usuarios
3. **Crear Database User**:
   - Username & Password
   - Database Access → Add New User
4. **Whitelist IPs**:
   - Network Access → Add IP Address
   - Allow Access from Anywhere: `0.0.0.0/0`
5. **Obtener Connection String**:
   - Connect → Connect your application
   - Copy connection string
   - Reemplazar `<password>` con tu password

### 2. Cloudinary (Almacenamiento - GRATIS hasta 25GB)

1. **Crear cuenta**: https://cloudinary.com
2. **Obtener credenciales**:
   - Dashboard → Copy API Environment variable
   - O copiar individualmente:
     - Cloud Name
     - API Key
     - API Secret

## ⚙️ Variables de Entorno por Plataforma

### Railway (Backend)
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/mipedacito
JWT_SECRET=super_secreto_random_key_12345
FRONTEND_URL=https://mi-pedacito.vercel.app
CLOUDINARY_CLOUD_NAME=tu_cloud
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=tu_secret
```

### Vercel (Frontend)
```env
REACT_APP_API_URL=https://tu-backend.up.railway.app/api
REACT_APP_SOCKET_URL=https://tu-backend.up.railway.app
```

## 🔒 Checklist de Seguridad Pre-Deploy

- [ ] Cambiar `JWT_SECRET` a algo aleatorio y seguro
- [ ] No commitear archivos `.env` a Git (ya están en .gitignore)
- [ ] Usar HTTPS en producción (automático en Railway/Vercel)
- [ ] Configurar CORS correctamente
- [ ] Verificar que MongoDB esté en whitelist

## 🧪 Testing Pre-Deploy

Antes de hacer deploy, asegúrate de que todo funciona localmente:

```bash
# Terminal 1 - Backend
cd mi-pedacito-backend
npm run dev

# Terminal 2 - Frontend
cd mi-pedacito-frontend
npm start

# Probar:
✓ Registro de usuario
✓ Login
✓ Subir foto
✓ Together Mode (permite micrófono)
✓ Ver estado online/offline
```

## 📱 Configuración Post-Deploy

### 1. Verificar Backend

Visita: `https://tu-backend.up.railway.app/health`

Deberías ver:
```json
{
  "status": "OK",
  "message": "Mi Pedacito de Ti API está funcionando 💕"
}
```

### 2. Probar Frontend

Visita: `https://tu-app.vercel.app`

- Debería cargar la pantalla de login
- Registrar primer usuario
- Registrar segundo usuario (máximo 2)

### 3. Configurar PWA

Para hacer la app instalable en móviles:

1. El frontend debe estar en HTTPS (automático en Vercel)
2. Abrir en móvil
3. Instalar desde el navegador

## 🎯 Dominio Personalizado (Opcional)

### Comprar dominio:
- Namecheap: ~$10/año
- GoDaddy: ~$12/año
- Google Domains: ~$12/año

Sugerencias de dominios:
- `mipedacitodeti.com`
- `juntos-siempre.com`
- `oscar-y-tu.love`

### Configurar en Vercel:
1. Domains → Add Domain
2. Agregar DNS records que te indica Vercel

### Configurar en Railway:
1. Settings → Domains → Add Custom Domain

## 🔄 Deploy Automático con Git

Una vez configurado, cada push a GitHub hará deploy automático:

```bash
git add .
git commit -m "Nueva funcionalidad"
git push origin main

# Vercel y Railway deployarán automáticamente
```

## 📊 Monitoreo

### Railway Logs:
```bash
railway logs
```

O en el dashboard: Deployments → View Logs

### Vercel Logs:
Dashboard → Project → Deployments → View Function Logs

## 🐛 Troubleshooting Común

### Error: "Application failed to respond"
- Verifica que el `PORT` esté configurado correctamente
- Railway usa `process.env.PORT` dinámicamente

### Error: "CORS blocked"
- Asegúrate de que `FRONTEND_URL` en backend sea la URL correcta de Vercel
- Incluye `https://` completo

### Error: "Cannot connect to database"
- Verifica connection string de MongoDB
- Asegura que 0.0.0.0/0 esté en whitelist

### Build falla en Vercel
- Verifica que las dependencias estén en `package.json`
- No debe haber errores de TypeScript

## 💰 Costos

| Servicio | Plan Gratuito | Límites |
|----------|---------------|---------|
| Railway | Free | 500 horas/mes |
| Vercel | Hobby | 100GB bandwidth |
| MongoDB Atlas | M0 Free | 512MB storage |
| Cloudinary | Free | 25GB storage, 25GB bandwidth |

**Total: $0/mes** para uso personal

## 🎁 Bonus: CI/CD Completo

Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

---

**¡Listo para lanzar! 🚀**

Una vez deployado, comparte la URL con Oscar y prepara un mensaje especial para el lanzamiento. 💕
