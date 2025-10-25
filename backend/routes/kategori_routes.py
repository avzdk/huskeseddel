"""
API routes for kategori (category) management.
"""
from flask import Blueprint, request, jsonify
from backend.config import db
from backend.models.kategori import Kategori

kategori_bp = Blueprint('kategorier', __name__)


@kategori_bp.route('/', methods=['GET'])
def get_kategorier():
    """Hent alle kategorier."""
    try:
        kategorier = Kategori.get_all()
        return jsonify([kategori.to_dict() for kategori in kategorier]), 200
    except Exception as e:
        return jsonify({'error': 'Kunne ikke hente kategorier', 'details': str(e)}), 500


@kategori_bp.route('/<int:kategori_id>', methods=['GET'])
def get_kategori(kategori_id):
    """Hent en specifik kategori."""
    try:
        kategori = Kategori.query.get(kategori_id)
        if not kategori:
            return jsonify({'error': 'Kategori ikke fundet'}), 404
        
        return jsonify(kategori.to_dict()), 200
    except Exception as e:
        return jsonify({'error': 'Kunne ikke hente kategori', 'details': str(e)}), 500


@kategori_bp.route('/', methods=['POST'])
def create_kategori():
    """Opret en ny kategori."""
    try:
        data = request.get_json()
        
        # Valider input
        if not data:
            return jsonify({'error': 'Ingen data modtaget'}), 400
        
        navn = data.get('navn', '').strip()
        if not navn:
            return jsonify({'error': 'Kategorinavn er påkrævet'}), 400
        
        # Check om kategori med samme navn allerede eksisterer
        existing = Kategori.find_by_name(navn)
        if existing:
            return jsonify({'error': f'Kategori med navn "{navn}" eksisterer allerede'}), 409
        
        # Opret ny kategori
        kategori = Kategori(
            navn=navn,
            beskrivelse=data.get('beskrivelse', '').strip() or None
        )
        
        db.session.add(kategori)
        db.session.commit()
        
        return jsonify(kategori.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Kunne ikke oprette kategori', 'details': str(e)}), 500


@kategori_bp.route('/<int:kategori_id>', methods=['PUT'])
def update_kategori(kategori_id):
    """Opdater en eksisterende kategori."""
    try:
        kategori = Kategori.query.get(kategori_id)
        if not kategori:
            return jsonify({'error': 'Kategori ikke fundet'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Ingen data modtaget'}), 400
        
        # Valider navn hvis det opdateres
        navn = data.get('navn', '').strip()
        if navn:
            # Check om andet kategori med samme navn eksisterer
            existing = Kategori.find_by_name(navn)
            if existing and existing.id != kategori_id:
                return jsonify({'error': f'Kategori med navn "{navn}" eksisterer allerede'}), 409
            kategori.navn = navn
        
        # Opdater beskrivelse
        if 'beskrivelse' in data:
            kategori.beskrivelse = data['beskrivelse'].strip() or None
        
        db.session.commit()
        return jsonify(kategori.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Kunne ikke opdatere kategori', 'details': str(e)}), 500


@kategori_bp.route('/<int:kategori_id>', methods=['DELETE'])
def delete_kategori(kategori_id):
    """Slet en kategori (kun hvis den ikke har varer)."""
    try:
        kategori = Kategori.query.get(kategori_id)
        if not kategori:
            return jsonify({'error': 'Kategori ikke fundet'}), 404
        
        # Check om kategorien har varer
        if kategori.varer:
            return jsonify({
                'error': f'Kategorien "{kategori.navn}" kan ikke slettes da den indeholder {len(kategori.varer)} varer'
            }), 409
        
        db.session.delete(kategori)
        db.session.commit()
        
        return jsonify({'message': f'Kategori "{kategori.navn}" blev slettet'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Kunne ikke slette kategori', 'details': str(e)}), 500