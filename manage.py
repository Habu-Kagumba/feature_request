import unittest

from flask_script import Manager
from app import app, db

manager = Manager(app)


@manager.command
def recreate_db():
    """ Recreates the Database. """
    db.drop_all()
    db.create_all()
    db.session.commit()

@manager.command
def test():
    """ Run tests """
    tests = unittest.TestLoader().discover('tests', pattern='test*.py')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        return 0
    return 1


if __name__ == "__main__":
    manager.run()
