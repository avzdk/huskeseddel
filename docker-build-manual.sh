#!/usr/bin/env bash
# Manual Docker build script for troubleshooting

echo "🔧 Manual Docker Build for Troubleshooting"
echo "========================================="
echo ""

# Create data directory
mkdir -p data

echo "📦 Building backend image..."
docker build -f Dockerfile.backend -t huskeseddel-backend . || {
    echo "❌ Backend build failed"
    exit 1
}

echo "✅ Backend image built successfully"
echo ""

echo "🌐 Building frontend manually..."

# Build frontend locally first
echo "   Step 1: Installing frontend dependencies..."
cd frontend
npm install || {
    echo "❌ npm install failed"
    exit 1
}

echo "   Step 2: Building frontend..."
npm run build || {
    echo "❌ Frontend build failed"
    exit 1
}

cd ..
echo "✅ Frontend built successfully"
echo ""

echo "📦 Building frontend Docker image..."
docker build -f Dockerfile.frontend -t huskeseddel-frontend . || {
    echo "❌ Frontend Docker build failed"
    exit 1
}

echo "✅ Frontend Docker image built successfully"
echo ""

echo "🚀 Starting containers..."

# Start backend
docker run -d \
    --name huskeseddel-backend-manual \
    --network huskeseddel-network \
    -p 5000:5000 \
    -v $(pwd)/data:/app/data \
    -e FLASK_ENV=production \
    -e DATABASE_URL=sqlite:///data/huskeseddel.db \
    -e SECRET_KEY=manual-secret-key \
    huskeseddel-backend || {
    
    # Create network if it doesn't exist
    echo "   Creating Docker network..."
    docker network create huskeseddel-network
    
    # Try again
    docker run -d \
        --name huskeseddel-backend-manual \
        --network huskeseddel-network \
        -p 5000:5000 \
        -v $(pwd)/data:/app/data \
        -e FLASK_ENV=production \
        -e DATABASE_URL=sqlite:///data/huskeseddel.db \
        -e SECRET_KEY=manual-secret-key \
        huskeseddel-backend
}

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 10

# Start frontend
docker run -d \
    --name huskeseddel-frontend-manual \
    --network huskeseddel-network \
    -p 3000:80 \
    huskeseddel-frontend

echo ""
echo "🎉 Containers started manually!"
echo ""
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend: http://localhost:5000"
echo ""
echo "🛑 To stop:"
echo "   docker stop huskeseddel-backend-manual huskeseddel-frontend-manual"
echo "   docker rm huskeseddel-backend-manual huskeseddel-frontend-manual"
echo ""

# Check status
echo "📊 Container status:"
docker ps | grep huskeseddel