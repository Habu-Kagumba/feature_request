import json

from tests.base import BaseTestCase


class TestHelloWorld(BaseTestCase):
    """ Test for the defulat route """

    def test_hello_world(self):
        """ Ensure responds with 'world' """
        response = self.client.get('/hello')
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 200)
        self.assertIn('world', data['message'])
        self.assertIn('success', data['status'])
