# Huskeseddel Backend API

Backend API for Huskeseddel indkøbsliste systemet bygget med Flask og SQLite.

## 🚀 Kom i gang

### Forudsætninger
- Python 3.12+
- uv (Python package manager)

### Installation

1. **Installer dependencies:**
```bash
uv sync
```

2. **Start backend serveren:**
```bash
python run_backend.py
```

Serveren starter på `http://localhost:5000`

### Database
Backend bruger SQLite database som gemmes i `huskeseddel.db` filen. Databasen oprettes automatisk ved første start med sample data.

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Server health check

### Kategorier
- `GET /api/kategorier` - Hent alle kategorier
- `GET /api/kategorier/<id>` - Hent specifik kategori
- `POST /api/kategorier` - Opret ny kategori
- `PUT /api/kategorier/<id>` - Opdater kategori
- `DELETE /api/kategorier/<id>` - Slet kategori

### Varer
- `GET /api/varer` - Hent varer (med søgning og filtrering)
  - Query params: `q` (søgeterm), `kategori_id` (kan gentages for flere)
- `GET /api/varer/<id>` - Hent specifik vare
- `POST /api/varer` - Opret ny vare
- `PUT /api/varer/<id>` - Opdater vare
- `DELETE /api/varer/<id>` - Slet vare
- `GET /api/varer/kategori/<kategori_id>` - Hent varer i kategori

### Indkøbsliste
- `GET /api/indkoebsliste` - Hent aktive elementer på listen
- `GET /api/indkoebsliste/historik` - Hent købte varer (historik)
- `POST /api/indkoebsliste/tilfoej` - Tilføj vare til liste
- `PUT /api/indkoebsliste/<id>` - Opdater liste element
- `POST /api/indkoebsliste/<id>/koeb` - Marker som købt
- `POST /api/indkoebsliste/<id>/genaktiver` - Genaktiver købt vare
- `DELETE /api/indkoebsliste/<id>` - Fjern fra liste
- `DELETE /api/indkoebsliste/ryd-købte` - Fjern alle købte varer
- `GET /api/indkoebsliste/stats` - Hent liste statistik

## 📋 Eksempel requests

### Opret kategori
```bash
curl -X POST http://localhost:5000/api/kategorier \
  -H "Content-Type: application/json" \
  -d '{"navn": "Snacks", "beskrivelse": "Chips og søde sager"}'
```

### Opret vare
```bash
curl -X POST http://localhost:5000/api/varer \
  -H "Content-Type: application/json" \
  -d '{"navn": "Chips", "kategori_id": 1, "note_vareregister": "Forskellige slags"}'
```

### Tilføj til indkøbsliste
```bash
curl -X POST http://localhost:5000/api/indkoebsliste/tilfoej \
  -H "Content-Type: application/json" \
  -d '{"vare_id": 1, "note_liste": "Husk sourcream and onion"}'
```

### Søg efter varer
```bash
# Søg efter "mælk"
curl "http://localhost:5000/api/varer?q=mælk"

# Filtrer på kategorier 1 og 2
curl "http://localhost:5000/api/varer?kategori_id=1&kategori_id=2"

# Kombiner søgning og filtrering
curl "http://localhost:5000/api/varer?q=ost&kategori_id=1"
```

## 🗄️ Database Schema

### Tabeller

#### kategori
- `id` (PRIMARY KEY)
- `navn` (UNIQUE, NOT NULL)
- `beskrivelse` (TEXT)
- `oprettelsesdato` (DATETIME)

#### vare
- `id` (PRIMARY KEY)
- `navn` (NOT NULL)
- `kategori_id` (FOREIGN KEY -> kategori.id)
- `note_vareregister` (TEXT)
- `oprettelsesdato` (DATETIME)

#### indkoebsliste_element
- `id` (PRIMARY KEY)
- `vare_id` (FOREIGN KEY -> vare.id)
- `note_liste` (TEXT)
- `tilfoejelsesdato` (DATETIME)
- `status` ('aktiv' eller 'købt')

## 🛠️ Udvikling

### Projektstruktur
```
backend/
├── app.py                 # Flask application factory
├── config/
│   ├── config.py         # App konfiguration
│   └── database.py       # Database setup og sample data
├── models/
│   ├── kategori.py       # Kategori model
│   ├── vare.py          # Vare model  
│   └── indkoebsliste_element.py  # Indkøbsliste element model
├── routes/
│   ├── kategori_routes.py    # Kategori API endpoints
│   ├── vare_routes.py       # Vare API endpoints
│   └── indkoebsliste_routes.py  # Indkøbsliste API endpoints
└── utils/
    └── validation.py     # Input validering
```

### Database management

**Nulstil database:**
```python
from backend.config.database import reset_database
from backend.app import create_app

app = create_app()
with app.app_context():
    reset_database()
```

## 🔧 Konfiguration

Miljøvariabler:
- `FLASK_ENV` - development/production (default: development)
- `DATABASE_URL` - Database URL (default: SQLite lokal fil)
- `SECRET_KEY` - Flask secret key (default: development key)
- `PORT` - Server port (default: 5000)

## 📊 Features implementeret

✅ **Kategori management**
- CRUD operationer
- Validering af duplikerede navne
- Forhindrer sletning af kategorier med varer

✅ **Vare management** 
- CRUD operationer med kategori relationer
- Søgefunktionalitet (partial match)
- Filtrering på kategorier (multi-select)
- Validering af input

✅ **Indkøbsliste management**
- Aktiv liste vs købt historik
- Tilføj/fjern varer
- Marker som købt/genaktiver
- Liste statistik
- Forhindrer duplikater på aktiv liste

✅ **Robusthed**
- Omfattende fejlhåndtering
- Input validering
- Database constraints
- Cascade delete for relaterede data