#!/usr/bin/env python3
"""
Huskeseddel - Indkøbsliste system
Startup script til backend server
"""
import os
import sys

# Tilføj backend directory til Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.app import create_app

def main():
    """Main entry point."""
    # Set environment
    env = os.environ.get('FLASK_ENV', 'development')
    
    # Create app
    app = create_app(env)
    
    # Run server
    if env == 'development':
        print("🛒 Starter Huskeseddel backend i development mode...")
        print("📡 API tilgængelig på: http://localhost:5000")
        print("📋 Health check: http://localhost:5000/api/health")
        print("📚 API endpoints:")
        print("   - Kategorier: /api/kategorier")
        print("   - Varer: /api/varer") 
        print("   - Indkøbsliste: /api/indkoebsliste")
        print("\n💡 Tryk Ctrl+C for at stoppe serveren")
        
        # Suppress multiprocessing warnings in development
        import warnings
        warnings.filterwarnings("ignore", category=UserWarning, module="multiprocessing.resource_tracker")
        
        app.run(
            debug=True,
            host='0.0.0.0',
            port=5000,
            use_reloader=True,
            threaded=True  # Use threading instead of multiprocessing
        )
    else:
        print("🔧 Starting Huskeseddel backend in production mode...")
        print("📡 API listening on port 5000")
        app.run(
            debug=False,
            host='0.0.0.0',
            port=int(os.environ.get('PORT', 5000))
        )

if __name__ == '__main__':
    main()