# 🛒 Huskeseddel - Indkøbsliste System

Komplet backend løsning til familiehusholdningers indkøbslister bygget med Python Flask og SQLite.

## ✅ Implementeret Backend

Jeg har bygget en fuldt funktionel REST API backend baseret på din kravspecifikation og tekniske krav:

### 🏗️ Arkitektur
- **Framework**: Flask med SQLAlchemy ORM
- **Database**: SQLite (lokal persistering)  
- **API Design**: RESTful endpoints med JSON
- **Validering**: Omfattende input validering og fejlhåndtering
- **CORS**: Aktiveret for React frontend integration

### 📊 Database Implementation

Implementeret baseret på Mermaid ER-diagrammet:

#### Tabeller:
- **kategori** - Varegrupper (Mejeriprodukter, Kød, etc.)
- **vare** - Vareregister med kategorier og noter
- **indkoebsliste_element** - Aktive/købte varer på listen

#### Relationer:
- En kategori → Mange varer (1:n)
- En vare → Mange liste elementer (1:n)  
- Cascade delete for dataintegritet

### 🚀 API Endpoints

#### Kategorier (`/api/kategorier`)
- `GET /` - Hent alle kategorier
- `POST /` - Opret ny kategori  
- `PUT /<id>` - Opdater kategori
- `DELETE /<id>` - Slet kategori (kun hvis tom)

#### Varer (`/api/varer`)
- `GET /` - Hent varer med søgning (`?q=`) og filtrering (`?kategori_id=`)
- `POST /` - Opret ny vare med kategori
- `PUT /<id>` - Opdater vare
- `DELETE /<id>` - Slet vare

#### Indkøbsliste (`/api/indkoebsliste`) 
- `GET /` - Aktive varer på listen
- `GET /historik` - Købte varer (historik)
- `POST /tilfoej` - Tilføj vare til liste
- `POST /<id>/koeb` - Marker som købt
- `DELETE /<id>` - Fjern fra liste
- `GET /stats` - Liste statistik

### 🛡️ Funktionalitet Implementeret

✅ **Alle funktionelle krav opfyldt:**
- **FR-001** til **FR-011**: Vareregistrering, kategoristyring, søgning/filtrering, listeadministration

✅ **Ikke-funktionelle krav:**
- **NFR-003**: Optimeret søgning med database indeksering
- **NFR-004**: Skalerbar til 1000+ varer
- **NFR-005**: SQLite lokal datapersistering  
- **NFR-006**: Automatisk gem via ORM transactions

✅ **Robusthed:**
- Omfattende input validering
- Proper HTTP statuskoder (200, 201, 400, 404, 409, 500)
- Transactional database operationer
- Fejlhåndtering med beskrivende meddelelser

## 🔧 Kørselsanvisninger

### 🐳 Docker (Anbefalet - Production Ready)
```bash
# Hurtig start
./docker-start.sh

# Eller manuelt
docker compose up -d

# Åbn applikationen
# Frontend: http://localhost:3000  
# Backend: http://localhost:5000
```

### 💻 Lokal Udvikling
```bash
# Backend
uv sync
uv run python run_backend.py

# Frontend (ny terminal)
cd frontend && npm install && npm run dev
```

### 3. Test Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Hent kategorier  
curl http://localhost:5000/api/kategorier

# Søg efter varer
curl "http://localhost:5000/api/varer?q=mælk"

# Hent indkøbsliste
curl http://localhost:5000/api/indkoebsliste
```

## 📁 Projektstruktur

```
/home/allan/huskeseddel/
├── backend/
│   ├── app.py                    # Flask application factory
│   ├── models/                   # Database modeller
│   │   ├── kategori.py           # Kategori model
│   │   ├── vare.py              # Vare model  
│   │   └── indkoebsliste_element.py # Liste element model
│   ├── routes/                   # API endpoints
│   │   ├── kategori_routes.py    # Kategori CRUD
│   │   ├── vare_routes.py       # Vare CRUD + søgning
│   │   └── indkoebsliste_routes.py # Liste management
│   ├── config/                   # Konfiguration
│   │   ├── config.py            # Flask/DB config
│   │   └── database.py          # DB setup + sample data
│   └── utils/
│       └── validation.py        # Input validering
├── run_backend.py               # Startup script
├── pyproject.toml               # Dependencies og metadata
├── kravspecifikation.md         # Detaljeret kravspec
├── BACKEND_README.md            # API dokumentation
└── huskeseddel.db              # SQLite database (auto-oprettet)
```

## 🎯 Næste Skridt

Backend'en er klar til integration med React frontend. Du kan:

1. **Teste API'et** med de medfølgende curl kommandoer
2. **Bygge React frontend** der kalder disse endpoints  
3. **Deploy løsningen** med Flask + React

Alle krav fra kravspecifikationen er implementeret og backend'en understøtter alle de ønskede workflows for familiehusholdningers indkøbslister! 🎉