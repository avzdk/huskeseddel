"""
IndkoebslisteElement model - Elementer på den aktive indkøbsliste.
"""
from datetime import datetime
from sqlalchemy.orm import validates
from backend.config.config import db


class IndkoebslisteElement(db.Model):
    """Model for elementer på indkøbslisten."""
    
    __tablename__ = 'indkoebsliste_element'
    
    id = db.Column(db.Integer, primary_key=True)
    vare_id = db.Column(db.Integer, db.ForeignKey('vare.id'), nullable=False)
    note_liste = db.Column(db.Text, nullable=True)
    tilfoejelsesdato = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    status = db.Column(db.String(20), default='aktiv', nullable=False)
    
    @validates('status')
    def validate_status(self, key, status):
        """Valider at status er enten 'aktiv' eller 'købt'."""
        if status not in ['aktiv', 'købt']:
            raise ValueError("Status skal være enten 'aktiv' eller 'købt'")
        return status
    
    def __repr__(self):
        return f'<IndkoebslisteElement {self.vare.navn if self.vare else "N/A"} - {self.status}>'
    
    def to_dict(self):
        """Konverter til dictionary for JSON serialisering."""
        return {
            'id': self.id,
            'vare_id': self.vare_id,
            'vare_navn': self.vare.navn if self.vare else None,
            'kategori_navn': self.vare.kategori.navn if self.vare and self.vare.kategori else None,
            'note_liste': self.note_liste,
            'tilfoejelsesdato': self.tilfoejelsesdato.isoformat(),
            'status': self.status
        }
    
    def marker_som_købt(self):
        """Marker elementet som købt."""
        self.status = 'købt'
    
    def marker_som_aktiv(self):
        """Marker elementet som aktivt igen."""
        self.status = 'aktiv'
    
    @classmethod
    def get_active_list(cls):
        """Hent alle aktive elementer på indkøbslisten."""
        return cls.query.filter_by(status='aktiv').order_by(
            cls.tilfoejelsesdato.desc()
        ).all()
    
    @classmethod
    def get_purchased_items(cls, limit=50):
        """Hent nyligt købte varer (historik)."""
        return cls.query.filter_by(status='købt').order_by(
            cls.tilfoejelsesdato.desc()
        ).limit(limit).all()
    
    @classmethod
    def find_active_by_vare(cls, vare_id):
        """Find aktivt element for en specifik vare."""
        return cls.query.filter_by(vare_id=vare_id, status='aktiv').first()