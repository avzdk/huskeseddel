#!/usr/bin/env bash
# Port cleanup script for Docker deployment

echo "🔍 Checking for processes using ports 5000 and 3000..."
echo ""

# Check port 5000 (backend)
echo "Port 5000 (Backend):"
lsof -ti:5000 | head -5 | while read pid; do
    if [ -n "$pid" ]; then
        echo "  PID $pid: $(ps -p $pid -o comm= 2>/dev/null || echo 'Unknown process')"
    fi
done

# Check port 3000 (frontend)  
echo ""
echo "Port 3000 (Frontend):"
lsof -ti:3000 | head -5 | while read pid; do
    if [ -n "$pid" ]; then
        echo "  PID $pid: $(ps -p $pid -o comm= 2>/dev/null || echo 'Unknown process')"
    fi
done

echo ""
echo "🛑 Stopping processes..."

# Kill processes on port 5000
echo "Stopping processes on port 5000..."
lsof -ti:5000 | xargs kill -9 2>/dev/null || echo "  No processes found on port 5000"

# Kill processes on port 3000
echo "Stopping processes on port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "  No processes found on port 3000"

# Also stop any existing Docker containers
echo ""
echo "🐳 Stopping existing Docker containers..."
docker stop huskeseddel-backend huskeseddel-frontend 2>/dev/null || echo "  No containers to stop"
docker rm huskeseddel-backend huskeseddel-frontend 2>/dev/null || echo "  No containers to remove"

# Stop docker-compose services if running
docker compose down 2>/dev/null || echo "  No compose services running"

echo ""
echo "✅ Port cleanup complete!"
echo ""
echo "🚀 Now you can start Docker:"
echo "   ./docker-start.sh"
echo "   OR"
echo "   docker compose up -d"