#!/bin/bash

# 🚀 Script para iniciar ambos servidores

echo "💕 Iniciando Mi Pedacito de Ti..."
echo "=================================="
echo ""

# Función para manejar Ctrl+C
function cleanup {
    echo ""
    echo "🛑 Deteniendo servidores..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔧 Iniciando Backend...${NC}"
cd mi-pedacito-backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Esperar a que el backend inicie
sleep 3

if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Backend corriendo en http://localhost:5000${NC}"
else
    echo -e "${RED}❌ Error al iniciar backend. Ver backend.log${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}💻 Iniciando Frontend...${NC}"
cd mi-pedacito-frontend
npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Esperar a que el frontend inicie
sleep 5

if ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Frontend corriendo en http://localhost:3000${NC}"
else
    echo -e "${RED}❌ Error al iniciar frontend. Ver frontend.log${NC}"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 ¡Todo está corriendo!${NC}"
echo ""
echo "📍 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   API:      http://localhost:5000/api"
echo "   Health:   http://localhost:5000/health"
echo ""
echo "📋 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo -e "${YELLOW}Presiona Ctrl+C para detener ambos servidores${NC}"
echo ""

# Mantener el script corriendo
wait
