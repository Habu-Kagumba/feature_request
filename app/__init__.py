from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()


def create_app():
    # Instantiate the application
    app = Flask(__name__)

    # Enable CORS
    CORS(app)

    # Config
    app.config.from_object('app.config.base')
    app.config.from_envvar('APP_CONFIG_FILE')

    # DB Extensions
    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)

    # Blueprints && PluggableViews
    from app.api import api_blueprint
    from app.auth import auth_blueprint

    app.register_blueprint(api_blueprint)
    app.register_blueprint(auth_blueprint)

    return app
