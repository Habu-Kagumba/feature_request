import datetime

from marshmallow import Schema, fields

from app import db


class UserSchema(Schema):
    username = fields.String(required=True)
    email = fields.Email(required=True)
    role = fields.String(required=True)
    created_at = fields.DateTime()


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(128), nullable=False, unique=True)
    email = db.Column(db.String(128), nullable=False, unique=True)
    role = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)

    def __init__(self, username, email, role):
        self.username = username
        self.email = email
        self.role = role
        self.created_at = datetime.datetime.utcnow()
