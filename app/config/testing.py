import os


DEBUG = True
TESTING = True
SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_TEST_URL')
BCRYPT_LOG_ROUNDS = 4
TOKEN_EXPIRATION_DAYS = 0
TOKEN_EXPIRATION_SECONDS = 3
