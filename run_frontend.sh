#!/usr/bin/env bash
# Huskeseddel Frontend Development Server

cd "$(dirname "$0")/frontend"

echo "🌐 Starting Frontend Development Server..."
echo "📍 http://localhost:3000 (dev mode)"
echo "💡 Use Docker for production (ports 3041/3042)"

if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

npm run dev