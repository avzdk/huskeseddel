#!/usr/bin/env bash
# Quick port check and cleanup

echo "🔍 Port Status Check"
echo "==================="
echo ""

# Function to check port
check_port() {
    local port=$1
    local service=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "❌ Port $port ($service) is BUSY"
        echo "   Process: $(lsof -Pi :$port -sTCP:LISTEN | tail -n 1 | awk '{print $1, $2}')"
        return 1
    else
        echo "✅ Port $port ($service) is FREE"
        return 0
    fi
}

# Check ports
check_port 5000 "Backend"
check_port 3000 "Frontend"
check_port 5001 "Alt Backend"  
check_port 3001 "Alt Frontend"

echo ""
echo "🐳 Docker containers:"
docker ps --filter "name=huskeseddel" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "No Docker containers running"

echo ""
echo "💡 Options:"
echo "   ./docker-port-cleanup.sh  # Stop all processes on ports"
echo "   ./docker-start.sh         # Auto-select free ports"
echo "   docker compose down       # Stop Docker services"