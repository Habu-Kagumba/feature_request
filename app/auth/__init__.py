from flask import Blueprint

from app.auth.auth_view import (
    RegisterAPI, LoginAPI, LogoutAPI, StatusAPI)

auth_blueprint = Blueprint('auth', __name__)


register_api = RegisterAPI.as_view('register_api')
login_api = LoginAPI.as_view('login_api')
logout_api = LogoutAPI.as_view('logout_api')
status_api = StatusAPI.as_view('status_api')

auth_blueprint.add_url_rule(
    '/auth/signup', view_func=register_api, methods=['POST'])
auth_blueprint.add_url_rule(
    '/auth/login', view_func=login_api, methods=['POST'])
auth_blueprint.add_url_rule(
    '/auth/logout', view_func=logout_api, methods=['POST'])
auth_blueprint.add_url_rule(
    '/auth/check', view_func=status_api, methods=['GET'])

__all__ = ['auth_blueprint']
