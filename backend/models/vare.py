"""
Vare model - Vareregister med kategorier og noter.
"""
from datetime import datetime
from sqlalchemy.orm import validates
from backend.config.config import db


class Vare(db.Model):
    """Model for varer i vareregisteret."""
    
    __tablename__ = 'vare'
    
    id = db.Column(db.Integer, primary_key=True)
    navn = db.Column(db.String(200), nullable=False)
    kategori_id = db.Column(db.Integer, db.ForeignKey('kategori.id'), nullable=False)
    note_vareregister = db.Column(db.Text, nullable=True)
    oprettelsesdato = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationship til indkøbsliste elementer
    indkoebsliste_elementer = db.relationship(
        'IndkoebslisteElement', 
        backref='vare', 
        lazy=True,
        cascade='all, delete-orphan'
    )
    
    @validates('navn')
    def validate_navn(self, key, navn):
        """Valider at varenavnet ikke er tomt."""
        if not navn or not navn.strip():
            raise ValueError("Varenavn må ikke være tomt")
        return navn.strip()
    
    def __repr__(self):
        return f'<Vare {self.navn}>'
    
    def to_dict(self):
        """Konverter til dictionary for JSON serialisering."""
        return {
            'id': self.id,
            'navn': self.navn,
            'kategori_id': self.kategori_id,
            'kategori_navn': self.kategori.navn if self.kategori else None,
            'note_vareregister': self.note_vareregister,
            'oprettelsesdato': self.oprettelsesdato.isoformat(),
            'paa_liste': any(elem.status == 'aktiv' for elem in self.indkoebsliste_elementer)
        }
    
    @classmethod
    def search(cls, query, kategori_ids=None):
        """Søg efter varer med valgfri kategorifiltrering."""
        search_query = cls.query
        
        if query:
            search_query = search_query.filter(
                cls.navn.ilike(f'%{query}%')
            )
        
        if kategori_ids:
            search_query = search_query.filter(
                cls.kategori_id.in_(kategori_ids)
            )
        
        return search_query.order_by(cls.navn).all()
    
    @classmethod
    def get_by_category(cls, kategori_id):
        """Hent alle varer i en specifik kategori."""
        return cls.query.filter_by(kategori_id=kategori_id).order_by(cls.navn).all()