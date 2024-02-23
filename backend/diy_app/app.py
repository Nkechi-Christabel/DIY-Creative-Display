#!/usr/bin/python3
from flask import Flask
from diy_app.models import db  # Import db from extensions.py
from diy_app.config import SECRET_KEY, DB_USER, DB_PWD, DB_HOST, DB_NAME
from flask_login import LoginManager
from diy_app.models.user import User
import os

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = SECRET_KEY
    app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql://{DB_USER}:{DB_PWD}@{DB_HOST}/{DB_NAME}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions
    db.init_app(app)  # Initialize db with the Flask app

    # Initialize login
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'login'

    @login_manager.user_loader
    def load_user(user_id):
    # Query and return the user object based on the user_id
        return User.query.get(user_id)

    # Import and register blueprints
    from backend.diy_app.routes import app_routes
    app.register_blueprint(app_routes)

    print("Connection string",  app.config['SQLALCHEMY_DATABASE_URI'])

    return app

if __name__ == "__main__":
    app = create_app()
    # HOST = os.getenv('FLASK_HOST', '0.0.0.0') 
    # PORT = int(os.getenv('FLASK_PORT', 5000)) 

    app.run(host='0.0.0.0', port=5000)