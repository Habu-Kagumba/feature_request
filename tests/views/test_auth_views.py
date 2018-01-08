import json
import datetime

from freezegun import freeze_time

from app.auth.blacklist_token_model import BlacklistToken
from tests.support.base import BaseTestCase
from tests.support.utils import UserHelpers
from tests.factories.user import UserFactory
from tests.support.utils import Repository

repository = Repository()


class TestAuthViews(BaseTestCase):

    """ Tests for auth views """

    def test_auth_registration(self):
        """ Test user registration """
        user = UserFactory.build()
        with self.client:
            response = UserHelpers(self.client).register(user)
            data = json.loads(response.data.decode())

            self.assertEqual(response.status_code, 201)
            self.assertEqual(user.username, data['username'])
            self.assertEqual(user.email, data['email'])
            self.assertEqual(user.role, data['role'])
            self.assertTrue(data['auth_token'])

    def test_auth_register_user_invalid_payload(self):
        """ Register a user with invalid payload """
        with self.client:
            response = self.client.post(
                '/auth/signup',
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
                'Missing data for required field.', ''.join(data['password']))
            self.assertIn(
                'Missing data for required field.', ''.join(data['role']))

    def test_auth_register_user_invalid_payload_missing_params(self):
        """ Register a user with invalid payload """
        with self.client:
            response = self.client.post(
                '/auth/signup',
                data=json.dumps(dict(role='FullStack Developer')),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())

            self.assertEqual(response.status_code, 400)
            self.assertIn(
                'Missing data for required field.', ''.join(data['username']))
            self.assertIn(
                'Missing data for required field.', ''.join(data['email']))

    def test_auth_register_duplicate_user(self):
        """ Test register an existing user """
        user = UserFactory()
        with self.client:
            response = UserHelpers(self.client).register(user)
            data = json.loads(response.data.decode())

            self.assertEqual(response.status_code, 202)
            self.assertIn(
                'User already exists. Please log in',
                ''.join(data['message']))

    def test_auth_login_user(self):
        """ Test user login """
        user = UserFactory.build()
        with self.client:
            UserHelpers(self.client).register(user)

            # Login
            response = self.client.post(
                '/auth/login',
                data=json.dumps(dict(username=user.email,
                                     password=user.password)),
                content_type='application/json'
            )

            data = json.loads(response.data.decode())

            self.assertEqual(data['message'], 'Login successful')
            self.assertTrue(data['auth_token'])
            self.assertTrue(response.status_code, 200)

    def test_auth_login_non_registered_user(self):
        """ Test non-registered user login """
        user = UserFactory.build()
        with self.client:
            response = UserHelpers(self.client).login(user)

            data = json.loads(response.data.decode())
            self.assertEqual(data['message'], 'Nope, try again!')
            self.assertEqual(response.status_code, 404)

    def test_auth_check_user(self):
        """ Test checking user status """
        user = UserFactory.build()
        with self.client:
            resp_signup = UserHelpers(self.client).register(user)

            response = self.client.get(
                '/auth/check',
                headers=dict(
                    Authorization='Bearer ' + json.loads(
                        resp_signup.data.decode()
                    )['auth_token']
                )
            )

            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 200)
            self.assertEqual(user.username, data['username'])
            self.assertEqual(user.email, data['email'])
            self.assertEqual(user.role, data['role'])

    def test_auth_user_logout(self):
        """ Testing user logout """
        user = UserFactory.build()
        with self.client:
            helper = UserHelpers(self.client)
            helper.register(user)
            resp_login = helper.login(user)

            response = self.client.post(
                '/auth/logout',
                headers=dict(
                    Authorization='Bearer ' + json.loads(
                        resp_login.data.decode()
                    )['auth_token']
                )
            )

            data = json.loads(response.data.decode())
            self.assertEqual(data['message'], 'Successfuly logged out')
            self.assertEqual(response.status_code, 200)

    def test_auth_user_invalid_logout(self):
        """ Testing invalid user logout """
        user = UserFactory.build()
        with self.client:
            initial_datetime = datetime.datetime(2017, 1, 1)
            other_datetime = datetime.datetime(2017, 1, 2)

            with freeze_time(initial_datetime) as frozen_datetime:
                helper = UserHelpers(self.client)
                helper.register(user)
                resp_login = helper.login(user)

                # Expire the token
                frozen_datetime.move_to(other_datetime)

                response = self.client.post(
                    '/auth/logout',
                    headers=dict(
                        Authorization='Bearer ' + json.loads(
                            resp_login.data.decode())['auth_token']
                    )
                )

                data = json.loads(response.data.decode())
                self.assertEqual(data['message'],
                                 'Signature Expired, please login again')
                self.assertEqual(response.status_code, 401)

    def test_auth_logout_blacklisted_token(self):
        """ User logout with blacklisted token """
        user = UserFactory.build()
        with self.client:
            helper = UserHelpers(self.client)
            helper.register(user)
            resp_login = helper.login(user)

            repository.new(
                BlacklistToken(token=json.loads(
                    resp_login.data.decode())['auth_token']))

            response = self.client.post(
                '/auth/logout',
                headers=dict(
                    Authorization='Bearer ' + json.loads(
                        resp_login.data.decode())['auth_token']
                )
            )

            data = json.loads(response.data.decode())
            self.assertEqual(
                data['message'],
                'Authentication token is blacklisted. Please login')
            self.assertEqual(response.status_code, 401)
