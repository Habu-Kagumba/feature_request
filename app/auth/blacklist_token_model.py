import datetime

from app import db


class BlacklistToken(db.Model):
    """ Table for storing tokens """
    __tablename__ = 'blacklist_tokens'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    token = db.Column(db.String(500), unique=True, nullable=False)
    when = db.Column(db.DateTime, nullable=False)

    def __init__(self, token):
        self.token = token
        self.when = datetime.datetime.utcnow()

    @staticmethod
    def check(auth_token):
        res = BlacklistToken.query.filter_by(token=str(auth_token)).first()
        return True if res else False
