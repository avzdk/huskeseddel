"""
Database initialiseringsscript og sample data.
"""
from backend.config.config import db
from backend.models import Kategori, Vare, IndkoebslisteElement


def create_tables():
    """Opret alle database tabeller."""
    db.create_all()


def init_sample_data():
    """Tilføj sample data til databasen."""
    
    # Check om der allerede er data
    if Kategori.query.first():
        print("Database indeholder allerede data, springer sample data over.")
        return
    
    # Opret sample kategorier
    kategorier = [
        Kategori(navn="Mejeriprodukter", beskrivelse="Mælk, ost, yoghurt osv."),
        Kategori(navn="Kød og Fisk", beskrivelse="Kød, fisk og fjerkræ"),
        Kategori(navn="Frugt og Grønt", beskrivelse="Friske frugter og grøntsager"),
        Kategori(navn="Brød og Korn", beskrivelse="Brød, pasta, ris osv."),
        Kategori(navn="Rengøringsmidler", beskrivelse="Sæbe, vaskemiddel osv."),
        Kategori(navn="Andet", beskrivelse="Diverse varer")
    ]
    
    for kategori in kategorier:
        db.session.add(kategori)
    
    db.session.commit()
    print(f"Oprettet {len(kategorier)} sample kategorier.")
    
    # Opret sample varer
    sample_varer = [
        # Mejeriprodukter
        ("Mælk", 1, "Letmælk 1,5%"),
        ("Ost", 1, "Almindelig skiveost"),
        ("Yoghurt", 1, "Naturel yoghurt"),
        ("Smør", 1, None),
        
        # Kød og Fisk
        ("Hakket oksekød", 2, "500g 8-12%"),
        ("Kyllingebryst", 2, None),
        ("Laks", 2, "Frisk laks"),
        
        # Frugt og Grønt
        ("Bananer", 3, None),
        ("Æbler", 3, "Gala eller Granny Smith"),
        ("Kartofler", 3, "Festkartofler"),
        ("Løg", 3, None),
        ("Tomater", 3, None),
        
        # Brød og Korn
        ("Rugbrød", 4, "Hjemmebagt eller Kohberg"),
        ("Pasta", 4, "Spaghetti eller penne"),
        ("Ris", 4, "Jasminris"),
        
        # Rengøringsmidler
        ("Opvaskemiddel", 5, None),
        ("Toiletpapir", 5, None),
        
        # Andet
        ("Kaffe", 6, "Formalet kaffe"),
        ("Te", 6, "Earl Grey eller English Breakfast")
    ]
    
    for navn, kategori_id, note in sample_varer:
        vare = Vare(
            navn=navn, 
            kategori_id=kategori_id, 
            note_vareregister=note
        )
        db.session.add(vare)
    
    db.session.commit()
    print(f"Oprettet {len(sample_varer)} sample varer.")


def reset_database():
    """Slet alle data og genopret tabeller."""
    db.drop_all()
    create_tables()
    init_sample_data()
    print("Database er blevet nulstillet med sample data.")