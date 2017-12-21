import sqlalchemy


from app.users.models import User

from tests.support.base import BaseTestCase
from tests.support.utils import Repository
from tests.factories.user import UserFactory

repository = Repository()


class TestUserModel(BaseTestCase):

    """ Test for user model """

    def test_model_add_user(self):
        """ Add a user """
        user = UserFactory.build()
        repository.new(User(
            username=user.username, email=user.email, role=user.role))

        self.assertEqual(
            User.query.filter_by(username=user.username).first().email,
            user.email
        )

    def test_model_add_duplicated_user(self):
        """ Add a duplicated user """
        user = UserFactory()

        with self.assertRaises(sqlalchemy.exc.IntegrityError):
            repository.new(User(
                username=user.username, email=user.email, role=user.role))
