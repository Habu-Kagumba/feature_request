import unittest

from flask import url_for
from flask_script import Manager

from app import create_app, db
from app.users.models import User # noqa

app = create_app()
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


@manager.command
def list_routes():
    output = []
    for rule in app.url_map.iter_rules():

        options = {}
        for arg in rule.arguments:
            options[arg] = "[{0}]".format(arg)

        methods = ','.join(rule.methods)
        url = url_for(rule.endpoint, **options)
        line = "{:50s} {:20s} {}".format(rule.endpoint, methods, url)
        output.append(line)

    for line in sorted(output):
        print(line)


if __name__ == "__main__":
    manager.run()
