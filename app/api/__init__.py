from flask import Blueprint

from app.api.user.view import UserAPI

api_blueprint = Blueprint('api', __name__)


users_api = UserAPI.as_view('users_api')

api_blueprint.add_url_rule(
    '/users/', defaults={'datum': None}, view_func=users_api,
    methods=['GET'])
api_blueprint.add_url_rule(
    '/users/<string:datum>', view_func=users_api,
    methods=['GET'])

__all__ = ['api_blueprint']
