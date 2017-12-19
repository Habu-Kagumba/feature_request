import os


DEBUG = True
TESTING = True
SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_TEST_URL')
