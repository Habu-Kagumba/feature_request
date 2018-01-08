from flask import jsonify
from flask.views import MethodView

from app.api.user.model import User, UserSchema

schema = UserSchema()


class UserAPI(MethodView):
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
                return jsonify(message='User exists')
