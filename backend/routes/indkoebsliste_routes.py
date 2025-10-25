"""
API routes for indkoebsliste (shopping list) management.
"""
from flask import Blueprint, request, jsonify
from backend.config import db
from backend.models.vare import Vare
from backend.models.indkoebsliste_element import IndkoebslisteElement

indkoebsliste_bp = Blueprint('indkoebsliste', __name__)


@indkoebsliste_bp.route('/', methods=['GET'])
def get_indkoebsliste():
    """Hent den aktive indkøbsliste."""
    try:
        aktive_elementer = IndkoebslisteElement.get_active_list()
        return jsonify([element.to_dict() for element in aktive_elementer]), 200
    except Exception as e:
        return jsonify({'error': 'Kunne ikke hente indkøbsliste', 'details': str(e)}), 500


@indkoebsliste_bp.route('/historik', methods=['GET'])
def get_historik():
    """Hent historik over købte varer."""
    try:
        limit = request.args.get('limit', 50, type=int)
        købte_elementer = IndkoebslisteElement.get_purchased_items(limit)
        return jsonify([element.to_dict() for element in købte_elementer]), 200
    except Exception as e:
        return jsonify({'error': 'Kunne ikke hente historik', 'details': str(e)}), 500


@indkoebsliste_bp.route('/tilfoej', methods=['POST'])
def tilfoej_til_liste():
    """Tilføj en vare til indkøbslisten."""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Ingen data modtaget'}), 400
        
        vare_id = data.get('vare_id')
        if not vare_id:
            return jsonify({'error': 'Vare ID er påkrævet'}), 400
        
        # Valider at varen eksisterer
        vare = Vare.query.get(vare_id)
        if not vare:
            return jsonify({'error': 'Varen eksisterer ikke'}), 404
        
        # Check om varen allerede er på den aktive liste
        eksisterende = IndkoebslisteElement.find_active_by_vare(vare_id)
        if eksisterende:
            return jsonify({
                'error': f'Varen "{vare.navn}" er allerede på indkøbslisten',
                'existing_element': eksisterende.to_dict()
            }), 409
        
        # Opret nyt liste element
        element = IndkoebslisteElement(
            vare_id=vare_id,
            note_liste=data.get('note_liste', '').strip() or None,
            status='aktiv'
        )
        
        db.session.add(element)
        db.session.commit()
        
        return jsonify(element.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Kunne ikke tilføje til liste', 'details': str(e)}), 500


@indkoebsliste_bp.route('/<int:element_id>', methods=['PUT'])
def update_liste_element(element_id):
    """Opdater et element på indkøbslisten."""
    try:
        element = IndkoebslisteElement.query.get(element_id)
        if not element:
            return jsonify({'error': 'Liste element ikke fundet'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Ingen data modtaget'}), 400
        
        # Opdater note på liste
        if 'note_liste' in data:
            element.note_liste = data['note_liste'].strip() or None
        
        # Opdater status
        if 'status' in data:
            status = data['status']
            if status not in ['aktiv', 'købt']:
                return jsonify({'error': 'Status skal være enten "aktiv" eller "købt"'}), 400
            element.status = status
        
        db.session.commit()
        return jsonify(element.to_dict()), 200
        
    except ValueError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Kunne ikke opdatere element', 'details': str(e)}), 500


@indkoebsliste_bp.route('/<int:element_id>/koeb', methods=['POST'])
def marker_som_købt(element_id):
    """Marker en vare som købt."""
    try:
        element = IndkoebslisteElement.query.get(element_id)
        if not element:
            return jsonify({'error': 'Liste element ikke fundet'}), 404
        
        if element.status == 'købt':
            return jsonify({'message': 'Varen er allerede markeret som købt'}), 200
        
        element.marker_som_købt()
        db.session.commit()
        
        return jsonify({
            'message': f'Varen "{element.vare.navn}" er markeret som købt',
            'element': element.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Kunne ikke markere som købt', 'details': str(e)}), 500


@indkoebsliste_bp.route('/<int:element_id>/genaktiver', methods=['POST'])
def genaktiver_element(element_id):
    """Genaktiver en købt vare (flyt tilbage til aktiv liste)."""
    try:
        element = IndkoebslisteElement.query.get(element_id)
        if not element:
            return jsonify({'error': 'Liste element ikke fundet'}), 404
        
        if element.status == 'aktiv':
            return jsonify({'message': 'Varen er allerede aktiv'}), 200
        
        element.marker_som_aktiv()
        db.session.commit()
        
        return jsonify({
            'message': f'Varen "{element.vare.navn}" er genaktiveret',
            'element': element.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Kunne ikke genaktivere element', 'details': str(e)}), 500


@indkoebsliste_bp.route('/<int:element_id>', methods=['DELETE'])
def fjern_fra_liste(element_id):
    """Fjern en vare helt fra indkøbslisten."""
    try:
        element = IndkoebslisteElement.query.get(element_id)
        if not element:
            return jsonify({'error': 'Liste element ikke fundet'}), 404
        
        vare_navn = element.vare.navn if element.vare else "Ukendt vare"
        db.session.delete(element)
        db.session.commit()
        
        return jsonify({'message': f'Varen "{vare_navn}" er fjernet fra listen'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Kunne ikke fjerne fra liste', 'details': str(e)}), 500


@indkoebsliste_bp.route('/ryd-købte', methods=['DELETE'])
def ryd_købte_varer():
    """Fjern alle købte varer fra listen."""
    try:
        købte_elementer = IndkoebslisteElement.query.filter_by(status='købt').all()
        
        if not købte_elementer:
            return jsonify({'message': 'Ingen købte varer at fjerne'}), 200
        
        antal = len(købte_elementer)
        for element in købte_elementer:
            db.session.delete(element)
        
        db.session.commit()
        
        return jsonify({'message': f'Fjernede {antal} købte varer fra listen'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Kunne ikke rydde købte varer', 'details': str(e)}), 500


@indkoebsliste_bp.route('/stats', methods=['GET'])
def get_liste_statistik():
    """Hent statistik over indkøbslisten."""
    try:
        aktive = IndkoebslisteElement.query.filter_by(status='aktiv').count()
        købte = IndkoebslisteElement.query.filter_by(status='købt').count()
        
        return jsonify({
            'aktive_varer': aktive,
            'købte_varer': købte,
            'total_varer': aktive + købte,
            'procent_købt': round((købte / (aktive + købte)) * 100, 1) if (aktive + købte) > 0 else 0
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Kunne ikke hente statistik', 'details': str(e)}), 500