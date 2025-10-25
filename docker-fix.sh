#!/usr/bin/env bash
# Quick fix for common Docker issues

echo "🛠️  Huskeseddel Docker Troubleshooting"
echo "======================================"
echo ""

echo "🧹 Cleaning up old containers and images..."

# Stop and remove existing containers
docker stop huskeseddel-backend huskeseddel-frontend 2>/dev/null || true
docker rm huskeseddel-backend huskeseddel-frontend 2>/dev/null || true

# Remove old images
docker rmi huskeseddel-backend huskeseddel-frontend 2>/dev/null || true

echo "✅ Cleanup complete"
echo ""

echo "📦 Pre-building frontend locally..."
cd frontend

# Clean install
rm -rf node_modules package-lock.json
npm install

# Build frontend
npm run build

cd ..
echo "✅ Frontend pre-built successfully"
echo ""

echo "🐳 Now try:"
echo "   ./docker-start.sh"
echo "   OR"
echo "   docker compose up --build"
echo "   OR"  
echo "   ./docker-build-manual.sh"