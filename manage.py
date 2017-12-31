import unittest
import coverage

from flask import url_for
from flask_script import Manager

from faker import Faker

from app import create_app, db
from app.users.models import User # noqa

COV = coverage.coverage(
    branch=True,
    include='./*',
    omit=[
        'tests/*',
        'env/*',
        'nginx/*',
        'manage.py'
    ]
)

COV.start()

app = create_app()
manager = Manager(app)


@manager.command
def recreate_db():
    """ Recreates the Database. """
    db.drop_all()
    db.create_all()
    db.session.commit()


@manager.command
def seed_db():
    """ Seeds the DB with some default records. """
    faker = Faker()

    # User
    users = []
    for i in list(range(10)):
        users.append({
            'username': faker.user_name(),
            'email': faker.email(),
            'role': faker.job()
        })

    for user in users:
        db.session.add(User(
            username=user['username'],
            email=user['email'],
            role=user['role']
        ))

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


@manager.command
def cov():
    """ Run tests with coverage """
    tests = unittest.TestLoader().discover('tests', pattern='test*.py')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        COV.stop()
        COV.save()
        print('Coverage summary')
        COV.report()
        COV.html_report()
        COV.erase()
        return 0
    return 1


if __name__ == "__main__":
    manager.run()
