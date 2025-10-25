"""
API routes for vare (item) management.
"""
from flask import Blueprint, request, jsonify
from backend.config import db
from backend.models.vare import Vare
from backend.models.kategori import Kategori

vare_bp = Blueprint('varer', __name__)


@vare_bp.route('/', methods=['GET'])
def get_varer():
    """Hent varer med valgfri søgning og filtrering."""
    try:
        # Hent query parametre
        search_query = request.args.get('q', '').strip()
        kategori_ids = request.args.getlist('kategori_id')
        
        # Konverter kategori_ids til integers
        if kategori_ids:
            try:
                kategori_ids = [int(kid) for kid in kategori_ids if kid.strip()]
            except ValueError:
                return jsonify({'error': 'Ugyldige kategori ID\'er'}), 400
        
        # Søg efter varer
        varer = Vare.search(search_query, kategori_ids if kategori_ids else None)
        
        return jsonify([vare.to_dict() for vare in varer]), 200
        
    except Exception as e:
        return jsonify({'error': 'Kunne ikke hente varer', 'details': str(e)}), 500


@vare_bp.route('/<int:vare_id>', methods=['GET'])
def get_vare(vare_id):
    """Hent en specifik vare."""
    try:
        vare = Vare.query.get(vare_id)
        if not vare:
            return jsonify({'error': 'Vare ikke fundet'}), 404
        
        return jsonify(vare.to_dict()), 200
    except Exception as e:
        return jsonify({'error': 'Kunne ikke hente vare', 'details': str(e)}), 500


@vare_bp.route('/', methods=['POST'])
def create_vare():
    """Opret en ny vare."""
    try:
        data = request.get_json()
        
        # Valider input
        if not data:
            return jsonify({'error': 'Ingen data modtaget'}), 400
        
        navn = data.get('navn', '').strip()
        if not navn:
            return jsonify({'error': 'Varenavn er påkrævet'}), 400
        
        kategori_id = data.get('kategori_id')
        if not kategori_id:
            return jsonify({'error': 'Kategori ID er påkrævet'}), 400
        
        # Valider at kategorien eksisterer
        kategori = Kategori.query.get(kategori_id)
        if not kategori:
            return jsonify({'error': 'Kategorien eksisterer ikke'}), 404
        
        # Opret ny vare
        vare = Vare(
            navn=navn,
            kategori_id=kategori_id,
            note_vareregister=data.get('note_vareregister', '').strip() or None
        )
        
        db.session.add(vare)
        db.session.commit()
        
        return jsonify(vare.to_dict()), 201
        
    except ValueError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Kunne ikke oprette vare', 'details': str(e)}), 500


@vare_bp.route('/<int:vare_id>', methods=['PUT'])
def update_vare(vare_id):
    """Opdater en eksisterende vare."""
    try:
        vare = Vare.query.get(vare_id)
        if not vare:
            return jsonify({'error': 'Vare ikke fundet'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Ingen data modtaget'}), 400
        
        # Opdater navn hvis angivet
        navn = data.get('navn', '').strip()
        if navn:
            vare.navn = navn
        
        # Opdater kategori hvis angivet
        kategori_id = data.get('kategori_id')
        if kategori_id:
            kategori = Kategori.query.get(kategori_id)
            if not kategori:
                return jsonify({'error': 'Kategorien eksisterer ikke'}), 404
            vare.kategori_id = kategori_id
        
        # Opdater note
        if 'note_vareregister' in data:
            vare.note_vareregister = data['note_vareregister'].strip() or None
        
        db.session.commit()
        return jsonify(vare.to_dict()), 200
        
    except ValueError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Kunne ikke opdatere vare', 'details': str(e)}), 500


@vare_bp.route('/<int:vare_id>', methods=['DELETE'])
def delete_vare(vare_id):
    """Slet en vare."""
    try:
        vare = Vare.query.get(vare_id)
        if not vare:
            return jsonify({'error': 'Vare ikke fundet'}), 404
        
        # Note: Dette vil også slette alle relaterede indkøbsliste elementer
        # på grund af cascade='all, delete-orphan'
        vare_navn = vare.navn
        db.session.delete(vare)
        db.session.commit()
        
        return jsonify({'message': f'Vare "{vare_navn}" blev slettet'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Kunne ikke slette vare', 'details': str(e)}), 500


@vare_bp.route('/kategori/<int:kategori_id>', methods=['GET'])
def get_varer_by_kategori(kategori_id):
    """Hent alle varer i en specifik kategori."""
    try:
        # Valider at kategorien eksisterer
        kategori = Kategori.query.get(kategori_id)
        if not kategori:
            return jsonify({'error': 'Kategorien eksisterer ikke'}), 404
        
        varer = Vare.get_by_category(kategori_id)
        return jsonify([vare.to_dict() for vare in varer]), 200
        
    except Exception as e:
        return jsonify({'error': 'Kunne ikke hente varer for kategori', 'details': str(e)}), 500