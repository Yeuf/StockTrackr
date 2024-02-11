from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from .models import CustomUser

class UserAuthenticationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.signup_url = reverse('signup')
        self.login_url = reverse('login')
        self.test_token_url = reverse('test_token')
        self.user_data = {'username': 'testuser', 'password': 'testpassword'}

    def test_user_signup(self):
        response = self.client.post(self.signup_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)

    def test_user_login(self):
        # First, signup the user
        self.client.post(self.signup_url, self.user_data, format='json')

        # Then, attempt login
        response = self.client.post(self.login_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)

    def test_test_token_authenticated(self):
        # First, signup and login the user
        self.client.post(self.signup_url, self.user_data, format='json')
        login_response = self.client.post(self.login_url, self.user_data, format='json')
        token = login_response.data['token']

        # Set the token in the client headers for authentication
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)

        # Then, access the token test endpoint
        response = self.client.get(self.test_token_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, "passed")

    def test_test_token_unauthenticated(self):
        # Accessing the token test endpoint without authentication should fail
        response = self.client.get(self.test_token_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_test_token_invalid_token(self):
        # Set an invalid token in the client headers for authentication
        self.client.credentials(HTTP_AUTHORIZATION='Token invalidtoken')

        # Accessing the token test endpoint with an invalid token should fail
        response = self.client.get(self.test_token_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
