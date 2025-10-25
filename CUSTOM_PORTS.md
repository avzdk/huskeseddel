# 🛒 Huskeseddel - Custom Ports Setup

## 📍 Custom Port Konfiguration

- **Backend API**: http://localhost:3041
- **Frontend**: http://localhost:3042

## 🚀 Quick Start

```bash
# Start med custom porte
./start-custom-ports.sh

# Eller manuelt
docker compose -f docker-compose.custom-ports.yml up -d
```

## 🔧 Management

```bash
# Se logs
docker compose -f docker-compose.custom-ports.yml logs -f

# Se status
docker compose -f docker-compose.custom-ports.yml ps

# Stop system
docker compose -f docker-compose.custom-ports.yml down

# Restart
docker compose -f docker-compose.custom-ports.yml restart
```

## 🧪 Test URLs

- **Health Check**: http://localhost:3041/api/health
- **Kategorier**: http://localhost:3041/api/kategorier
- **Varer**: http://localhost:3041/api/varer
- **Indkøbsliste**: http://localhost:3041/api/indkoebsliste
- **Frontend App**: http://localhost:3042

## 📋 Port Mapping

| Service  | External Port | Internal Port | Container Name |
|----------|---------------|---------------|----------------|
| Backend  | 3041         | 5000          | huskeseddel-backend |
| Frontend | 3042         | 80            | huskeseddel-frontend |

## 🔍 Troubleshooting

**Port konflikter:**
```bash
# Check hvad der bruger portene
lsof -i :3041
lsof -i :3042

# Stop processer
./docker-port-cleanup.sh
```

**Container problemer:**
```bash
# Rebuild alt
docker compose -f docker-compose.custom-ports.yml up --build --force-recreate
```