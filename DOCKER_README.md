# 🐳 Huskeseddel - Docker Deployment

Komplet indkøbsliste system med Docker Compose deployment.

## 🚀 Hurtig Start

### Forudsætninger
- Docker (version 20.10+)
- Docker Compose (version 2.0+)

### 1. Klon Repository
```bash
git clone <repository-url>
cd huskeseddel
```

### 2. Start Systemet
```bash
# Start alle services
docker compose up -d

# Se logs
docker compose logs -f

# Stop systemet
docker compose down
```

### 3. Åbn Applikationen
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📊 Services

### Backend (Flask + SQLite)
- **Port**: 5000
- **Health Check**: `/api/health`
- **Database**: SQLite i `/data` volume
- **Auto-restart**: Ja

### Frontend (React + Nginx)
- **Port**: 3000 (Nginx på port 80)
- **Reverse Proxy**: API calls til backend
- **Static Files**: Optimeret Nginx serving
- **Auto-restart**: Ja

## 🔧 Konfiguration

### Environment Variables

Opret `.env` fil i root directory:
```env
# Backend
SECRET_KEY=your-very-secure-secret-key-here
FLASK_ENV=production

# Database (standard SQLite i Docker volume)
DATABASE_URL=sqlite:///data/huskeseddel.db
```

### Volumes
- `./data:/app/data` - SQLite database persistering

## 📋 Docker Kommandoer

### Build og Start
```bash
# Build images og start
docker compose up --build -d

# Kun build
docker compose build

# Start i forground (se logs)
docker compose up
```

### Management
```bash
# Se status
docker compose ps

# Se logs
docker compose logs backend
docker compose logs frontend

# Restart en service
docker compose restart backend

# Scale (hvis nødvendigt)
docker compose up --scale backend=2
```

### Database Management
```bash
# Backup database
docker compose exec backend cp /app/data/huskeseddel.db /app/data/backup.db

# Access database
docker compose exec backend sqlite3 /app/data/huskeseddel.db
```

### Debugging
```bash
# Shell access til backend
docker compose exec backend bash

# Shell access til frontend
docker compose exec frontend sh

# Se container resources
docker stats
```

## 🔒 Sikkerhed

### Production Ready Features
- **Nginx Reverse Proxy** med security headers
- **Health Checks** for alle services
- **Non-root Users** i containers
- **Multi-stage Builds** for minimal image size
- **Gzip Compression** for frontend assets

### Environment Sikkerhed
- Alle secrets via environment variables
- Database i persistent volume
- No debug mode i production

## 📈 Monitoring & Logs

### Health Checks
```bash
# Check service health
docker compose ps

# Manual health check
curl http://localhost:5000/api/health
curl http://localhost:3000/
```

### Logs
```bash
# Alle services
docker compose logs -f

# Specifik service med timestamps
docker compose logs -f -t backend

# Sidste 100 linjer
docker compose logs --tail=100 frontend
```

## 🚀 Production Deployment

### På Server
```bash
# Clone og start
git clone <repo-url> huskeseddel
cd huskeseddel

# Sæt production environment
cp .env.template .env
# Rediger .env med dine værdier

# Start i production
docker compose up -d

# Check status
docker compose ps
docker compose logs
```

### Updates
```bash
# Pull nye changes
git pull

# Rebuild og restart
docker compose up --build -d

# Clean up gamle images
docker system prune
```

### Backup
```bash
# Backup database
cp data/huskeseddel.db backups/huskeseddel-$(date +%Y%m%d).db

# Eller via Docker
docker compose exec backend cp /app/data/huskeseddel.db /app/data/backup-$(date +%Y%m%d).db
```

## 🐛 Troubleshooting

### Almindelige Problemer

**Backend starter ikke:**
```bash
# Check logs
docker compose logs backend

# Rebuild
docker compose up --build backend
```

**Frontend viser ikke data:**
```bash
# Check API connection
curl http://localhost:5000/api/health

# Check nginx config
docker compose exec frontend cat /etc/nginx/conf.d/default.conf
```

**Database problemer:**
```bash
# Check volume
docker volume ls
docker volume inspect huskeseddel_huskeseddel-data

# Reset database
docker compose down
rm -rf data/
docker compose up -d
```

**Port conflicts:**
```bash
# Ændre porte i docker-compose.yml
ports:
  - "8000:5000"  # Backend på port 8000
  - "8080:80"    # Frontend på port 8080
```

### Performance Tuning
```bash
# Resource limits i docker-compose.yml
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
```

## 📚 API Dokumentation

Med systemet kørende, API endpoints er tilgængelige på:

- `GET /api/health` - Health check
- `GET /api/kategorier` - Alle kategorier  
- `GET /api/varer` - Alle varer (med søgning)
- `GET /api/indkoebsliste` - Aktiv indkøbsliste

Se `BACKEND_README.md` for komplet API dokumentation.

## 🎯 Features

✅ **Komplet Containerisering**  
✅ **Production-Ready Setup**  
✅ **Auto Health Checks**  
✅ **Database Persistering**  
✅ **Nginx Reverse Proxy**  
✅ **Security Headers**  
✅ **Gzip Compression**  
✅ **Easy Deployment**  

**Systemet er nu klar til production deployment! 🚀**