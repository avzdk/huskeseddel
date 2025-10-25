#!/usr/bin/env bash
# Huskeseddel Frontend Startup Script

cd "$(dirname "$0")/frontend"

echo "🚀 Starting Huskeseddel Frontend..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🌐 Starting development server on http://localhost:3000"
echo "🔗 API proxy configured for http://localhost:5000"
echo ""
echo "💡 Make sure backend is running on port 5000"
echo "💡 Press Ctrl+C to stop the server"
echo ""

npm run dev