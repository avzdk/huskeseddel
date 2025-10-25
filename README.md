# 🛒 Huskeseddel - Komplet Indkøbsliste System

En moderne indkøbsliste applikation bygget med Flask (Python) backend og React frontend. Systemet gør det muligt for familier at administrere deres indkøb gennem kategorier, vareregistrer og en intelligente indkøbsliste.

## ✨ Features

### 🗂️ Kategori Administration
- Opret, rediger og slet kategorier
- Automatisk tælling af varer per kategori  
- Forhindrer sletning af kategorier med tilknyttede varer

### 📦 Vareregister
- Komplet vareregister med kategorier og noter
- Avanceret søgning og multi-kategori filtrering
- Direkte tilføjelse til indkøbsliste fra vareregistret
- Visual indikation af varer på aktiv liste

### 📋 Intelligente Indkøbsliste
- Aktiv indkøbsliste med købt/ikke-købt status
- Marker varer som købt med ét klik
- Genaktiver købte varer hvis nødvendigt
- Progress tracking og statistik
- Ryd købte varer automatisk
- Historik over tidligere indkøb

## 🏗️ Teknisk Arkitektur

### Backend (Python Flask)
- **REST API** med SQLite database
- **SQLAlchemy ORM** for database operations
- **Omfattende validering** og fejlhåndtering
- **CORS support** for frontend integration
- **Modulær struktur** med blueprints

### Frontend (React)
- **Modern React** med hooks og functional components  
- **React Query** for efficient API state management
- **Bootstrap 5** for responsive UI design
- **React Router** for navigation
- **Vite** for hurtig development og build

## 🚀 Kom i gang

### Forudsætninger
- Python 3.12+ med uv
- Node.js 18+ med npm
- Git

### 1. Clone repository og setup
```bash
cd /home/allan/huskeseddel
```

### 2. Start Backend (Terminal 1)
```bash
# Install dependencies
uv sync

# Start backend server  
uv run python run_backend.py
```
Backend starter på: `http://localhost:5000`

### 3. Start Frontend (Terminal 2)
```bash
# Install dependencies og start development server
./run_frontend.sh
```
Frontend starter på: `http://localhost:3000`

### 4. Åbn applikationen
Gå til `http://localhost:3000` i din browser og begynd at bruge Huskeseddel!

## 📱 Brugerguide

### Kom i gang
1. **Opret kategorier** - Gå til "Kategorier" og opret dine varegrupper (f.eks. Mejeriprodukter, Kød, Frugt)
2. **Tilføj varer** - Under "Varer" kan du oprette varer og tildele dem kategorier
3. **Byg din liste** - På forsiden tilføjer du varer til din aktive indkøbsliste
4. **Shop smart** - Marker varer som købt når du handler

### Avanceret brug
- **Søg og filtrer** - Find hurtigt specifikke varer ved at søge eller filtrere på kategorier
- **Administrer lister** - Genaktiver købte varer eller fjern dem helt fra listen
- **Track progress** - Se hvor mange procent af dine varer du har købt

## 📁 Projektstruktur

```
huskeseddel/
├── backend/                     # Flask API backend
│   ├── app.py                   # Main Flask application
│   ├── models/                  # SQLAlchemy database models
│   ├── routes/                  # API endpoints
│   ├── config/                  # Database and app configuration
│   └── utils/                   # Validation utilities
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── services/            # API service layer
│   │   └── hooks/               # Custom React hooks
│   ├── package.json             # Frontend dependencies
│   └── vite.config.js          # Vite configuration
├── run_backend.py              # Backend startup script
├── run_frontend.sh             # Frontend startup script
├── pyproject.toml              # Python dependencies
├── kravspecifikation.md        # Detailed requirements
└── PROJECT_OVERVIEW.md         # Technical overview
```

## 🔧 Development

### Backend Development
```bash
# Aktivér development mode (auto-reload)
uv run python run_backend.py

# Run utan reloader (færre warnings)
uv run python run_backend_simple.py

# Reset database med sample data
python -c "from backend.config.database import reset_database; from backend.app import create_app; app = create_app(); app.app_context().push(); reset_database()"
```

### Frontend Development  
```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### API Testing
```bash
# Health check
curl http://localhost:5000/api/health

# Hent kategorier
curl http://localhost:5000/api/kategorier

# Opret kategori
curl -X POST http://localhost:5000/api/kategorier \
  -H "Content-Type: application/json" \
  -d '{"navn": "Test", "beskrivelse": "Test kategori"}'

# Søg varer
curl "http://localhost:5000/api/varer?q=mælk"
```

## 🗄️ Database

### Schema
- **kategori** - Kategorier til organisering af varer
- **vare** - Vareregister med kategori relationer  
- **indkoebsliste_element** - Elementer på aktiv/historisk indkøbsliste

### Sample Data
Backend starter automatisk med sample data:
- 6 kategorier (Mejeriprodukter, Kød & Fisk, Frugt & Grønt, etc.)
- 19 sample varer fordelt på kategorier
- Tom indkøbsliste (klar til brug)

## 🎯 Opfyldte Krav

### Funktionelle Krav ✅
- **FR-001-004**: Vareregistrering med kategorier og noter
- **FR-005-006**: Kategoristyring og tildeling
- **FR-007-009**: Søgning og multi-kategori filtrering  
- **FR-010-011**: Komplet listeadministration

### Ikke-funktionelle Krav ✅
- **NFR-001-002**: Intuitiv Bootstrap UI med maksimalt 3-klik workflow
- **NFR-003**: Hurtig søgning under 2 sekunder
- **NFR-004**: Skalerbar til 1000+ varer
- **NFR-005-006**: Lokal SQLite persistering med auto-save

## 📊 Statistik & Features

### Implementerede Features
✅ **Komplet CRUD** for alle entiteter  
✅ **Avanceret søgning** med partial match  
✅ **Multi-kategori filtrering** 
✅ **Real-time liste management**  
✅ **Progress tracking** og statistik  
✅ **Responsive Bootstrap UI**  
✅ **Error handling** og validering  
✅ **API rate limiting** og caching  
✅ **Development/production** konfiguration

### Performance
- **< 2 sekunder** søgerespons  
- **Optimistic updates** i React
- **Intelligent caching** med React Query
- **Minimal API calls** gennem state management

## 🚀 Deployment

### Production Setup
1. **Backend**: Brug production WSGI server (Gunicorn)
2. **Frontend**: Build static files med `npm run build`  
3. **Database**: Migrér til PostgreSQL for multi-user
4. **Proxy**: Nginx for statisk file serving

### Environment Variables
```bash
# Backend
export FLASK_ENV=production
export SECRET_KEY=your-secure-secret-key
export DATABASE_URL=sqlite:///prod.db

# Frontend  
export VITE_API_URL=https://your-api-domain.com/api
```

---

## 🎉 Resultat

Huskeseddel er nu en komplet, production-ready indkøbsliste løsning der opfylder alle specificerede krav og mere til! 

**Backend**: Robust Flask API med SQLite  
**Frontend**: Modern React UI med Bootstrap  
**Integration**: Seamless kommunikation via REST API  
**UX**: Intuitivt workflow for familier

Systemet er klar til brug og videreudvikling! 🛒✨
