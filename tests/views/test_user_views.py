import json

from tests.support.base import BaseTestCase
from tests.factories.user import UserFactory


class TestUserViews(BaseTestCase):

    """ Tests for users views """

    def test_view_add_user(self):
        """ Add a user """
        with self.client:
            payload = dict(
                username='habu',
                email='habukagumba@gmail.com',
                role='FullStack Developer')
            response = self.client.post(
                '/users/',
                data=json.dumps(payload),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())

            self.assertEqual(response.status_code, 201)
            self.assertEqual(payload['username'], data['username'])
            self.assertEqual(payload['email'], data['email'])
            self.assertEqual(payload['role'], data['role'])

    def test_view_add_user_invalid_payload(self):
        """ Add a user with invalid payload """
        with self.client:
            response = self.client.post(
                '/users/',
                data=json.dumps(dict(email='habu')),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())

            self.assertEqual(response.status_code, 400)
            self.assertIn(
                'Missing data for required field.', ''.join(data['username']))
            self.assertIn(
                'Not a valid email address.', ''.join(data['email']))
            self.assertIn(
                'Missing data for required field.', ''.join(data['role']))

    def test_view_add_user_invalid_payload_missing_params(self):
        """ Add a user with invalid payload """
        with self.client:
            response = self.client.post(
                '/users/',
                data=json.dumps(dict(role='FullStack Developer')),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())

            self.assertEqual(response.status_code, 400)
            self.assertIn(
                'Missing data for required field.', ''.join(data['username']))
            self.assertIn(
                'Missing data for required field.', ''.join(data['email']))

    def test_view_add_duplicate_user(self):
        """ Add a duplicate user """
        with self.client:
            user = UserFactory.create()
            response = self.client.post(
                '/users/',
                data=json.dumps(dict(
                    username=user.username,
                    email=user.email,
                    role=user.role
                )),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())

            self.assertEqual(response.status_code, 400)
            self.assertIn(
                'duplicate key value violates unique constraint',
                ''.join(data['message']))

    def test_view_get_single_user(self):
        """ Get a single user """
        user = UserFactory()
        with self.client:
            response = self.client.get(f'/users/{user.username}')
            data = json.loads(response.data.decode())

            self.assertEqual(response.status_code, 200)
            self.assertEqual(user.username, data['username'])
            self.assertEqual(user.email, data['email'])
            self.assertEqual(user.role, data['role'])

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
