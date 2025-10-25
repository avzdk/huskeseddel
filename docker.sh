#!/usr/bin/env bash
# Simple Docker start for Huskeseddel

echo "🛒 Starting Huskeseddel Docker..."
mkdir -p data

docker compose up --build -d

echo ""
echo "🎉 Huskeseddel is running!"
echo "📍 Frontend: http://localhost:3042"  
echo "📍 Backend: http://localhost:3041"
echo ""
echo "Commands:"
echo "  docker compose logs -f     # View logs"
echo "  docker compose down        # Stop system"