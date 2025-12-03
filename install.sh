#!/bin/bash

# 🚀 Script de Quick Start para Mi Pedacito de Ti
# Este script instalará todo lo necesario y levantará la aplicación

echo "💕 Mi Pedacito de Ti - Quick Start"
echo "===================================="
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "Por favor instala Node.js desde: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado"
    exit 1
fi

echo "✅ npm $(npm -v) detectado"
echo ""

# Preguntar si quiere instalar MongoDB local o usar Atlas
echo "🗄️  MongoDB Setup:"
echo "1) Usar MongoDB local (necesitas tenerlo instalado)"
echo "2) Usar MongoDB Atlas (cloud - gratis)"
echo "3) Configurar después manualmente"
read -p "Selecciona opción (1/2/3): " mongo_option

if [ "$mongo_option" = "1" ]; then
    # Verificar MongoDB
    if ! command -v mongod &> /dev/null; then
        echo ""
        echo "⚠️  MongoDB no está instalado localmente"
        echo ""
        echo "Para macOS:"
        echo "  brew tap mongodb/brew"
        echo "  brew install mongodb-community"
        echo ""
        echo "Para Ubuntu/Debian:"
        echo "  wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -"
        echo "  sudo apt-get install -y mongodb-org"
        echo ""
        echo "Después de instalar MongoDB, ejecuta este script de nuevo."
        exit 1
    fi
    
    echo "✅ MongoDB detectado"
    echo "🔄 Iniciando MongoDB..."
    
    # Iniciar MongoDB en background
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew services start mongodb-community > /dev/null 2>&1
    else
        sudo systemctl start mongod > /dev/null 2>&1
    fi
    
    MONGODB_URI="mongodb://localhost:27017/mipedacito"
elif [ "$mongo_option" = "2" ]; then
    echo ""
    echo "📝 MongoDB Atlas Setup:"
    echo "1. Ve a: https://www.mongodb.com/cloud/atlas"
    echo "2. Crea una cuenta gratuita"
    echo "3. Crea un cluster (M0 FREE)"
    echo "4. Crea un usuario de base de datos"
    echo "5. Whitelist IP: 0.0.0.0/0"
    echo "6. Obtén el connection string"
    echo ""
    read -p "Pega tu MongoDB connection string aquí: " MONGODB_URI
else
    echo "⏭️  Saltando configuración de MongoDB"
    echo "Recuerda configurar MONGODB_URI en mi-pedacito-backend/.env"
    MONGODB_URI="mongodb://localhost:27017/mipedacito"
fi

echo ""
echo "📦 Instalando dependencias del Backend..."
cd mi-pedacito-backend
npm install

# Actualizar .env si se configuró MongoDB
if [ ! -z "$MONGODB_URI" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|MONGODB_URI=.*|MONGODB_URI=$MONGODB_URI|" .env
    else
        sed -i "s|MONGODB_URI=.*|MONGODB_URI=$MONGODB_URI|" .env
    fi
fi

echo "✅ Backend configurado"
echo ""

echo "📦 Instalando dependencias del Frontend..."
cd ../mi-pedacito-frontend
npm install
echo "✅ Frontend configurado"
echo ""

cd ..

echo "🎉 ¡Todo listo!"
echo ""
echo "Para iniciar la aplicación:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd mi-pedacito-backend"
echo "  npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd mi-pedacito-frontend"
echo "  npm start"
echo ""
echo "O ejecuta: ./start.sh"
echo ""
echo "La app estará disponible en: http://localhost:3000"
echo ""
echo "💕 ¡Disfruta Mi Pedacito de Ti!"
