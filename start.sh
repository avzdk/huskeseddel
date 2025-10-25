#!/usr/bin/env bash
# Huskeseddel - Samlet Startup Guide
# Starter både backend og frontend i separate terminaler

echo "🛒 Huskeseddel - Komplet Indkøbsliste System"
echo "============================================="
echo ""

# Check hvis vi er i riktig directory
if [ ! -f "pyproject.toml" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Fejl: Kør dette script fra /home/allan/huskeseddel directory"
    exit 1
fi

echo "🔧 Forbereder system..."

# Backend setup
echo "📡 Installerer backend dependencies..."
if ! command -v uv &> /dev/null; then
    echo "❌ uv er ikke installeret. Installer uv først: pip install uv"
    exit 1
fi

uv sync > /dev/null 2>&1
echo "✅ Backend dependencies installeret"

# Frontend setup  
echo "🌐 Installerer frontend dependencies..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install > /dev/null 2>&1
fi
cd ..
echo "✅ Frontend dependencies installeret"

echo ""
echo "🚀 Starter Huskeseddel system..."
echo "================================"
echo ""
echo "📍 Backend: http://localhost:5000"  
echo "📍 Frontend: http://localhost:3000"
echo ""
echo "💡 Følgende terminaler vil åbne:"
echo "   - Terminal 1: Flask Backend"
echo "   - Terminal 2: React Frontend"
echo ""
echo "💡 Tryk Ctrl+C i begge terminaler for at stoppe"
echo ""

# Start backend i baggrunden
echo "🔧 Starter backend..."
gnome-terminal -- bash -c 'cd /home/allan/huskeseddel && echo "🔧 Starting Backend Server..." && uv run python run_backend.py; read -p "Press enter to close..."' 2>/dev/null || \
konsole -e bash -c 'cd /home/allan/huskeseddel && echo "🔧 Starting Backend Server..." && uv run python run_backend.py; read -p "Press enter to close..."' 2>/dev/null || \
xterm -e 'cd /home/allan/huskeseddel && echo "🔧 Starting Backend Server..." && uv run python run_backend.py; read -p "Press enter to close..."' 2>/dev/null || \
echo "⚠️  Kunne ikke åbne ny terminal. Start backend manuelt: uv run python run_backend.py"

sleep 2

# Start frontend i baggrunden  
echo "🌐 Starter frontend..."
gnome-terminal -- bash -c 'cd /home/allan/huskeseddel/frontend && echo "🌐 Starting Frontend Server..." && npm run dev; read -p "Press enter to close..."' 2>/dev/null || \
konsole -e bash -c 'cd /home/allan/huskeseddel/frontend && echo "🌐 Starting Frontend Server..." && npm run dev; read -p "Press enter to close..."' 2>/dev/null || \
xterm -e 'cd /home/allan/huskeseddel/frontend && echo "🌐 Starting Frontend Server..." && npm run dev; read -p "Press enter to close..."' 2>/dev/null || \
echo "⚠️  Kunne ikke åbne ny terminal. Start frontend manuelt: cd frontend && npm run dev"

echo ""
echo "🎉 Huskeseddel system starter!"
echo "Vent 5-10 sekunder og gå til: http://localhost:3000"
echo ""
echo "📚 Hvis terminalerne ikke åbnede automatisk:"
echo "   Terminal 1: uv run python run_backend.py"
echo "   Terminal 2: cd frontend && npm run dev"
echo ""
echo "📖 Se README.md for mere info"