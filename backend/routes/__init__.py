"""
Routes module initialization.
"""
from .kategori_routes import kategori_bp
from .vare_routes import vare_bp
from .indkoebsliste_routes import indkoebsliste_bp

__all__ = ['kategori_bp', 'vare_bp', 'indkoebsliste_bp']