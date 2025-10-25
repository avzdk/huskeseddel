#!/usr/bin/env bash
# Quick start script for Docker deployment

echo "🐳 Huskeseddel Docker Deployment"
echo "==============================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker er ikke installeret"
    echo "   Installer Docker først: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose er ikke tilgængeligt" 
    echo "   Opdater Docker til en nyere version"
    exit 1
fi

echo "✅ Docker og Docker Compose fundet"

# Create data directory if it doesn't exist
mkdir -p data

# Check if .env exists, if not create from template
if [ ! -f ".env" ]; then
    echo "📝 Opretter .env fil fra template..."
    cp .env.docker .env
    echo "⚠️  Husk at ændre SECRET_KEY i .env til production!"
fi

echo ""
echo "� Checking for port conflicts..."

# Check if ports are in use
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port 5000 is busy. Using alternative ports..."
    echo "   Backend will be on port 5001"
    echo "   Frontend will be on port 3001"
    COMPOSE_FILE="docker-compose.alt-ports.yml"
    FRONTEND_PORT="3001"
    BACKEND_PORT="5001"
else
    COMPOSE_FILE="docker-compose.yml"
    FRONTEND_PORT="3000"
    BACKEND_PORT="5000"
fi

echo ""
echo "�🚀 Starter Huskeseddel system..."

# Build and start services
docker compose -f $COMPOSE_FILE up --build -d

echo ""
echo "⏳ Venter på at services starter..."
sleep 10

# Check health
echo "🔍 Checker service status..."
docker compose ps

echo ""
echo "🎉 Huskeseddel system kører!"
echo ""
echo "📍 Frontend: http://localhost:$FRONTEND_PORT"
echo "📍 Backend API: http://localhost:$BACKEND_PORT"
echo ""
echo "📋 Nyttige kommandoer:"
echo "   docker compose logs -f    # Se logs"
echo "   docker compose ps         # Se status"  
echo "   docker compose down       # Stop system"
echo ""
echo "📚 Se DOCKER_README.md for mere information"