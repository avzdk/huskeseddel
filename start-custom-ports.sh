#!/usr/bin/env bash
# Huskeseddel startup med custom porte
# Backend: 3041, Frontend: 3042

echo "🛒 Huskeseddel - Custom Port Setup"
echo "=================================="
echo ""

# Check hvis vi er i rigtigt directory
if [ ! -f "pyproject.toml" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Fejl: Kør dette script fra /home/allan/huskeseddel directory"
    exit 1
fi

echo "🔧 Forbereder system med custom porte..."

# Create data directory
mkdir -p data

# Check if .env exists, if not create from template
if [ ! -f ".env" ]; then
    echo "📝 Opretter .env fil fra template..."
    cp .env.docker .env
    echo "⚠️  Husk at ændre SECRET_KEY i .env til production!"
fi

# Check ports
echo "🔍 Checker om porte 3041 og 3042 er ledige..."

if lsof -Pi :3041 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port 3041 er optaget!"
    echo "   Process: $(lsof -Pi :3041 -sTCP:LISTEN | tail -n 1 | awk '{print $1, $2}')"
    read -p "   Stop processen og fortsæt? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        lsof -ti:3041 | xargs kill -9 2>/dev/null || true
    else
        exit 1
    fi
fi

if lsof -Pi :3042 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port 3042 er optaget!"
    echo "   Process: $(lsof -Pi :3042 -sTCP:LISTEN | tail -n 1 | awk '{print $1, $2}')"
    read -p "   Stop processen og fortsæt? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        lsof -ti:3042 | xargs kill -9 2>/dev/null || true
    else
        exit 1
    fi
fi

echo ""
echo "🚀 Starter Huskeseddel med custom porte..."

# Build and start services with custom compose file
docker compose -f docker-compose.custom-ports.yml up --build -d

echo ""
echo "⏳ Venter på at services starter..."
sleep 15

# Check health
echo "🔍 Checker service status..."
docker compose -f docker-compose.custom-ports.yml ps

echo ""
echo "🎉 Huskeseddel system kører på custom porte!"
echo ""
echo "📍 Backend API: http://localhost:3041"
echo "📍 Frontend: http://localhost:3042"
echo ""
echo "🔗 Test links:"
echo "   curl http://localhost:3041/api/health"
echo "   open http://localhost:3042"
echo ""
echo "📋 Management kommandoer:"
echo "   docker compose -f docker-compose.custom-ports.yml logs -f"
echo "   docker compose -f docker-compose.custom-ports.yml ps"
echo "   docker compose -f docker-compose.custom-ports.yml down"
echo ""
echo "📚 Se DOCKER_README.md for mere information"