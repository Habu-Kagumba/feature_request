from flask import request, jsonify, abort, make_response
from sqlalchemy import exc

from app import db
from app.base.views import APIEndpoint
from app.users.models import User, UserSchema

schema = UserSchema()


class UserAPI(APIEndpoint):

    def post(self):
        """ Create a user """

        payload = request.json or {}

        payload_data, errors = schema.load(payload)
        if errors:
            return jsonify(errors), 400

        try:
            username = payload_data.get('username')
            email = payload_data.get('email')
            role = payload_data.get('role')
            user = User(username=username, email=email, role=role)
            db.session.add(user)
            db.session.commit()

            return jsonify(schema.dump(user).data), 201
        except exc.IntegrityError as e:
            abort(make_response(jsonify(message=e.orig.args), 400))

    def get(self, datum):
        """ Get user(s)

        :datum: The user's username or email. If empty, get all users
        """
        if datum is None:
            return jsonify(schema.dump(User.query.all(), many=True).data)
        else:
            user = User.query.filter(
                (User.username == datum) | (User.email == datum)).first()
            if not user:
                return jsonify(message='User not found'), 404
            else:
                return jsonify(schema.dump(user).data)
