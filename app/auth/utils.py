import jwt
import datetime

from functools import wraps
from flask import current_app, request, jsonify

from app.auth.blacklist_token_model import BlacklistToken


def encode_auth_token(user_id):
    """ Generates an Auth Token. """
    try:
        payload = dict(
            exp=datetime.datetime.utcnow() + datetime.timedelta(
                days=current_app.config.get('TOKEN_EXPIRATION_DAYS'),
                seconds=current_app.config.get('TOKEN_EXPIRATION_SECONDS')
            ),
            iat=datetime.datetime.utcnow(),
            sub=user_id
        )

        return jwt.encode(
            payload,
            current_app.config.get('SECRET_KEY'),
            algorithm='HS256'
        )
    except Exception as e:
        return e


def decode_auth_token(auth_token):
    """ Validate / Decode Auth Token for user

    :auth_token: Authentication token to decode
    :returns: integer|string - user id.
    """

    try:
        payload = jwt.decode(
            auth_token, current_app.config.get('SECRET_KEY'))
        blacklisted = BlacklistToken.check(auth_token)
        if blacklisted:
            return 'Authentication token is blacklisted. Please login'
        return payload['sub']
    except jwt.ExpiredSignatureError as e:
        return 'Signature Expired, please login again'
    except jwt.InvalidTokenError as e:
        return 'Invalid authentication token'


def authenticate(f):
    """ Authentication decorator """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        auth_token = auth_header.split(' ')[1]
        if not auth_token:
            return jsonify(
                message='Please provide a valid authentication token'), 403

        resp = decode_auth_token(auth_token)
        if isinstance(resp, str):
            return jsonify(message=resp), 401

        return f(resp, *args, **kwargs)
    return decorated_function
