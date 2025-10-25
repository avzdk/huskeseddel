# Huskeseddel - Quick Start

En simpel indkøbsliste applikation med Flask backend og React frontend.

## 🚀 Docker Opstart (Anbefalet)

Kør systemet med Docker (simplest):

```bash
./docker.sh
```

Eller manuelt:
```bash
docker compose up --build -d
```

Applikationen vil være tilgængelig på:
- Frontend: http://localhost:3042
- Backend API: http://localhost:3041

Stop systemet:
```bash
docker compose down
```

## 🛠️ Lokal Udvikling

Start backend:
```bash
uv run python run_backend.py
```

Start frontend (i ny terminal):
```bash
cd frontend && npm run dev
```

## 📚 Dokumentation

Se `README.md` for fuld dokumentation.