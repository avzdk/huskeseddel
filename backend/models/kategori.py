"""
Kategori model - Kategorier til organisering af varer.
"""
from datetime import datetime
from backend.config.config import db


class Kategori(db.Model):
    """Model for varekategorier."""
    
    __tablename__ = 'kategori'
    
    id = db.Column(db.Integer, primary_key=True)
    navn = db.Column(db.String(100), unique=True, nullable=False)
    beskrivelse = db.Column(db.Text, nullable=True)
    oprettelsesdato = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationship til varer
    varer = db.relationship('Vare', backref='kategori', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Kategori {self.navn}>'
    
    def to_dict(self):
        """Konverter til dictionary for JSON serialisering."""
        return {
            'id': self.id,
            'navn': self.navn,
            'beskrivelse': self.beskrivelse,
            'oprettelsesdato': self.oprettelsesdato.isoformat(),
            'antal_varer': len(self.varer)
        }
    
    @classmethod
    def find_by_name(cls, navn):
        """Find kategori ved navn."""
        return cls.query.filter_by(navn=navn).first()
    
    @classmethod
    def get_all(cls):
        """Hent alle kategorier sorteret efter navn."""
        return cls.query.order_by(cls.navn).all()