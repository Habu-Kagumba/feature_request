from factory import Faker, alchemy

from app import db
from app.api.user.model import User


class UserFactory(alchemy.SQLAlchemyModelFactory):
    class Meta:
        model = User
        sqlalchemy_session = db.session

    username = Faker('user_name')
    email = Faker('email')
    password = Faker('pystr')
    role = Faker('job')
