"""
Main Flask application for Huskeseddel (Shopping List) system.
"""
import os
from flask import Flask
from flask_cors import CORS

from backend.config import config, db
from backend.models.kategori import Kategori
from backend.models.vare import Vare
from backend.models.indkoebsliste_element import IndkoebslisteElement


def create_app(config_name=None):
    """Application factory for creating Flask app instance."""
    
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    app.config.from_object(config.get(config_name, config['default']))
    
    # Initialize extensions
    db.init_app(app)
    CORS(app)  # Enable CORS for React frontend
    
    # Register blueprints
    from backend.routes import kategori_bp, vare_bp, indkoebsliste_bp
    
    app.register_blueprint(kategori_bp, url_prefix='/api/kategorier')
    app.register_blueprint(vare_bp, url_prefix='/api/varer')
    app.register_blueprint(indkoebsliste_bp, url_prefix='/api/indkoebsliste')
    
    # Health check endpoint
    @app.route('/api/health')
    def health_check():
        return {'status': 'healthy', 'message': 'Huskeseddel API is running'}
    
    # Create tables and sample data on first run
    with app.app_context():
        from backend.config.database import create_tables, init_sample_data
        
        # Check if tables exist, if not create them
        try:
            db.create_all()
            init_sample_data()
        except Exception as e:
            app.logger.error(f"Error initializing database: {e}")
    
    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)