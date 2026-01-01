from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
import sys
from dotenv import load_dotenv

# Add parent directory to sys.path to allow imports from backend
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Load environment variables from .env and .env.local
load_dotenv()
load_dotenv('.env.local')

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Configuration
    # Use /tmp/ directory for SQLite in serverless environments (like Vercel) if no DATABASE_URL provided
    default_db = 'sqlite:///' + os.path.join(os.getcwd(), 'polystepai.db')
    if os.environ.get('VERCEL_REGION'):
        # On Vercel, we can only write to /tmp. 
        # Note: Data will be lost on cold starts.
        default_db = 'sqlite:////tmp/polystepai.db'
        
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', default_db)
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    
    with app.app_context():
        import backend.routes as routes
        import backend.ai_routes as ai_routes
        app.register_blueprint(routes.bp)
        app.register_blueprint(ai_routes.bp)
        
        # Create tables
        db.create_all()
        
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
