#!/usr/bin/env python3
"""
Huskeseddel - Startup script uden reloader (production-like)
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.app import create_app

def main():
    """Main entry point - no reloader."""
    app = create_app('development')
    
    print("🛒 Starter Huskeseddel backend (no-reloader mode)...")
    print("📡 API tilgængelig på: http://localhost:5000")
    print("📋 Health check: http://localhost:5000/api/health")
    print("\n💡 Tryk Ctrl+C for at stoppe serveren")
    
    app.run(
        debug=False,  # No debug mode = no reloader
        host='0.0.0.0',
        port=5000
    )

if __name__ == '__main__':
    main()