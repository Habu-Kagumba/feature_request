import json

from tests.support.base import BaseTestCase
from tests.factories.user import UserFactory


class TestUserViews(BaseTestCase):

    """ Tests for users views """

    def test_view_get_single_user(self):
        """ Get a single user """
        user = UserFactory()
        with self.client:
            response = self.client.get(f'/users/{user.username}')
            data = json.loads(response.data.decode())

            self.assertEqual(response.status_code, 200)
            self.assertEqual('User exists', data['message'])

    def test_view_get_non_existent_user(self):
        """ Get a non-existent user """
        with self.client:
            response = self.client.get(f'/users/yoda')
            data = json.loads(response.data.decode())

            self.assertEqual(response.status_code, 404)
            self.assertEqual('User not found', data['message'])

    def test_view_get_all_users(self):
        """ Get all users """
        user1 = UserFactory()
        user2 = UserFactory()
        with self.client:
            response = self.client.get('/users/')
            data = json.loads(response.data.decode())

            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(data), 2)
            self.assertEqual(user1.username, data[0]['username'])
            self.assertEqual(user2.role, data[1]['role'])
