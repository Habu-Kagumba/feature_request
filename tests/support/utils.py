from app import db


class Repository(object):
    def __init__(self):
        self.session = db.session

    def new(self, entity):
        self.session.add(entity)
        self.session.commit()
        return entity
