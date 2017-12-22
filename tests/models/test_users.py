import sqlalchemy

from faker import Faker

from app.users.models import User, UserSchema

from tests.support.base import BaseTestCase
from tests.support.utils import Repository
from tests.factories.user import UserFactory

repository = Repository()
faker = Faker()


class TestUserModel(BaseTestCase):

    """ Test for user model """

    def test_model_add_user(self):
        """ Add a user """
        user = UserFactory.build()
        repository.new(User(
            username=user.username, email=user.email, role=user.role))
        get_user = User.query.filter_by(username=user.username).first()

        self.assertEqual(get_user.email, user.email)
        self.assertEqual(get_user.username, user.username)
        self.assertTrue(get_user.id)
        self.assertTrue(get_user.username)
        self.assertTrue(get_user.email)
        self.assertTrue(get_user.role)
        self.assertTrue(get_user.created_at)

    def test_model_add_duplicated_username(self):
        """ Add a duplicated username """
        user = UserFactory()

        with self.assertRaises(sqlalchemy.exc.IntegrityError):
            repository.new(User(
                username=user.username,
                email=faker.email(),
                role=faker.job())
            )

    def test_model_add_duplicated_email(self):
        """ Add a duplicated email """
        user = UserFactory()

        with self.assertRaises(sqlalchemy.exc.IntegrityError):
            repository.new(User(
                username=faker.user_name(),
                email=user.email,
                role=faker.job())
            )

    def test_model_user_schema_serialize(self):
        """ Test UserSchema Serialize """
        user_schema = UserSchema()
        uf = UserFactory.build()
        user = User(username=uf.username, email=uf.email, role=uf.role)
        data = user_schema.dump(user).data

        self.assertIsInstance(data, dict)
        self.assertEqual(data['username'], uf.username)
        self.assertEqual(data['email'], uf.email)
        self.assertEqual(data['role'], uf.role)

    def test_model_user_schema_deserialize(self):
        """ Test UserSchema De-serialize """
        user_schema = UserSchema()
        uf = UserFactory.build()
        uf_dict = dict(username=uf.username, email=uf.email, role=uf.role)
        data, errors = user_schema.load(uf_dict)

        self.assertIsInstance(data, dict)
        self.assertEqual(data.get('username'), uf.username)
        self.assertEqual(data.get('email'), uf.email)
        self.assertEqual(data.get('role'), uf.role)
