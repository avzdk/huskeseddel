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
echo "🚀 Starter Huskeseddel system..."

# Build and start services
docker compose up --build -d

echo ""
echo "⏳ Venter på at services starter..."
sleep 10

# Check health
echo "🔍 Checker service status..."
docker compose ps

echo ""
echo "🎉 Huskeseddel system kører!"
echo ""
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend API: http://localhost:5000"
echo ""
echo "📋 Nyttige kommandoer:"
echo "   docker compose logs -f    # Se logs"
echo "   docker compose ps         # Se status"  
echo "   docker compose down       # Stop system"
echo ""
echo "📚 Se DOCKER_README.md for mere information"