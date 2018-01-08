from flask import jsonify, request
from flask.views import MethodView
from sqlalchemy import exc

from app import db, bcrypt
from app.api.user.model import User, UserSchema
from app.auth.utils import encode_auth_token, decode_auth_token, authenticate
from app.auth.blacklist_token_model import BlacklistToken


schema = UserSchema()


class RegisterAPI(MethodView):

    """ User registration """

    def post(self):
        payload = request.json or {}

        payload_data, errors = schema.load(payload)
        if errors:
            return jsonify(errors), 400

        username = payload_data.get('username')
        email = payload_data.get('email')
        password = payload_data.get('password')
        role = payload_data.get('role')

        user = User.query.filter_by(email=email).first()

        if not user:
            try:
                user = User(username=username, email=email, password=password,
                            role=role)
                db.session.add(user)
                db.session.commit()

                auth_token = encode_auth_token(user.id)
                response_data = schema.dump(user).data
                response_data['auth_token'] = auth_token.decode()

                return jsonify(response_data), 201
            except exc.IntegrityError as e:
                return jsonify(
                    message='An error occurred, please try again'), 400
        else:
            return jsonify(message='User already exists. Please log in'), 202


class LoginAPI(MethodView):

    """ User Login """

    def post(self):
        payload = request.json or {}

        payload_data, errors = schema.load(payload, partial=True)
        if errors:
            return jsonify(errors), 400

        datum = payload_data.get('username')
        password = payload.get('password')
        try:
            user = User.query.filter(
                (User.username == datum) | (User.email == datum)).first()
            if user and bcrypt.check_password_hash(user.password, password):
                auth_token = encode_auth_token(user.id)
                if auth_token:
                    response = dict(
                        message='Login successful',
                        auth_token=auth_token.decode()
                    )
                    return jsonify(response), 200
            else:
                return jsonify(message='Nope, try again!'), 404
        except Exception as e:
            return jsonify(message='Login failed. Please try again'), 500


class LogoutAPI(MethodView):

    """ User logout """

    decorators = [authenticate]

    def post(self, resp):
        auth_header = request.headers.get('Authorization')
        auth_token = auth_header.split(' ')[1]
        blacklist_token = BlacklistToken(token=auth_token)
        try:
            db.session.add(blacklist_token)
            db.session.commit()
            return jsonify(message='Successfuly logged out'), 200
        except Exception as e:
            return jsonify(message=e), 500


class StatusAPI(MethodView):

    """ Check User status """

    def get(self):
        auth_token = request.headers.get('Authorization').split(' ')[1]
        resp = decode_auth_token(auth_token)
        user = User.query.filter_by(id=resp).first()
        return jsonify(schema.dump(user).data)
