from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token

class MeViewTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testauthor@example.com",
            email="testauthor@example.com",
            password="testpassword123",
            first_name="Test",
            last_name="Author",
            is_staff=True
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_me_view_success(self):
        url = "/api/auth/me/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "testauthor@example.com")
        self.assertEqual(response.data["first_name"], "Test")
        self.assertEqual(response.data["last_name"], "Author")
        self.assertTrue(response.data["is_staff"])

    def test_me_view_unauthenticated(self):
        self.client.credentials()  # Clear auth headers
        url = "/api/auth/me/"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

