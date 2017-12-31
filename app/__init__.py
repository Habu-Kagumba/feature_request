from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Database
db = SQLAlchemy()


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

    # Blueprints && PluggableViews
    from app.users.views import UserAPI
    from app.base.views import api

    users_api = UserAPI.as_view('users_api')
    app.add_url_rule(
        '/users/', defaults={'datum': None}, view_func=users_api,
        methods=['GET'])
    app.add_url_rule('/users/', view_func=users_api, methods=['POST'])
    app.add_url_rule(
        '/users/<string:datum>', view_func=users_api,
        methods=['GET'])
    app.register_blueprint(api)

    return app
