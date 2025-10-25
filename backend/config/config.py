"""
Database konfiguration for Huskeseddel applikationen.
"""
import os
from flask_sqlalchemy import SQLAlchemy

# Initialiser SQLAlchemy instansen
db = SQLAlchemy()


class Config:
    """Base konfiguration."""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # SQLite database sti
    basedir = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        f'sqlite:///{os.path.join(basedir, "..", "huskeseddel.db")}'


class DevelopmentConfig(Config):
    """Development konfiguration."""
    DEBUG = True
    SQLALCHEMY_ECHO = True  # Log SQL queries


class ProductionConfig(Config):
    """Production konfiguration."""
    DEBUG = False
    SQLALCHEMY_ECHO = False
    
    # Override database path for Docker
    basedir = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        f'sqlite:///data/huskeseddel.db'


class TestConfig(Config):
    """Test konfiguration."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'


# Konfiguration mapping
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestConfig,
    'default': DevelopmentConfig
}