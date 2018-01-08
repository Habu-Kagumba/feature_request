import json

from app import db


class Repository(object):
    def __init__(self):
        self.session = db.session

    def new(self, entity):
        self.session.add(entity)
        self.session.commit()
        return entity


class UserHelpers(object):
    def __init__(self, client):
        self.client = client

    def register(self, user):
        response = self.client.post(
            '/auth/signup',
            data=json.dumps(dict(
                username=user.username,
                email=user.email,
                password=user.password,
                role=user.role
            )),
            content_type='application/json'
        )
        return response

    def login(self, user):
        response = self.client.post(
            '/auth/login',
            data=json.dumps(dict(
                username=user.username,
                password=user.password
            )),
            content_type='application/json'
        )
        return response
