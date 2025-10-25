"""
Input validation utilities for the Huskeseddel API.
"""
from functools import wraps
from flask import request, jsonify


def validate_json(required_fields=None, optional_fields=None):
    """
    Decorator for validating JSON input.
    
    Args:
        required_fields (list): List of required field names
        optional_fields (list): List of optional field names with default values as dict
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Check if request contains JSON
            if not request.is_json:
                return jsonify({'error': 'Request skal indeholde JSON data'}), 400
            
            data = request.get_json()
            if not data:
                return jsonify({'error': 'Ingen JSON data modtaget'}), 400
            
            # Validate required fields
            if required_fields:
                missing_fields = []
                for field in required_fields:
                    if field not in data or not str(data[field]).strip():
                        missing_fields.append(field)
                
                if missing_fields:
                    return jsonify({
                        'error': f'Påkrævede felter mangler: {", ".join(missing_fields)}'
                    }), 400
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator


def validate_kategori_data():
    """Validate kategori creation/update data."""
    return validate_json(required_fields=['navn'])


def validate_vare_data():
    """Validate vare creation data."""
    return validate_json(required_fields=['navn', 'kategori_id'])


def validate_indkoebsliste_data():
    """Validate shopping list item data."""
    return validate_json(required_fields=['vare_id'])


class ValidationError(Exception):
    """Custom validation error."""
    def __init__(self, message, status_code=400):
        super().__init__(message)
        self.message = message
        self.status_code = status_code