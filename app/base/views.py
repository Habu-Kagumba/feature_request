from flask import Blueprint, current_app
from flask.views import MethodView

api = Blueprint('api', __name__)


class APIEndpoint(MethodView):
    """ Base API Endpoint """

    def __init__(self, *args, **kwargs):
        super(APIEndpoint, self).__init__(*args, **kwargs)
        self.logger = current_app.logger
