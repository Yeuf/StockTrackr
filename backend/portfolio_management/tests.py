from django.test import TestCase
from users.models import CustomUser
from .models import Portfolio, Investment
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken
import datetime

class PortfolioModelTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username='test9999', password='12345')
        self.portfolio = Portfolio.objects.create(user=self.user, name='Test Portfolio')

    def test_portfolio_creation(self):
        self.assertEqual(self.portfolio.user, self.user)
        self.assertEqual(self.portfolio.name, 'Test Portfolio')

class InvestmentModelTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username='test9999', password='12345')
        self.portfolio = Portfolio.objects.create(user=self.user, name='Test Portfolio')
        self.investment = Investment.objects.create(
            portfolio=self.portfolio, symbol='AAPL', quantity=10, transaction_type='BUY', 
            date=datetime.date(2024, 2, 15), price=105.75
        )

    def test_investment_creation(self):
        self.assertEqual(self.investment.portfolio, self.portfolio)
        self.assertEqual(self.investment.symbol, 'AAPL')
        self.assertEqual(self.investment.quantity, 10)
        self.assertEqual(self.investment.transaction_type, 'BUY')
        self.assertEqual(self.investment.date.strftime('%Y-%m-%d'), '2024-02-15')
        self.assertEqual(self.investment.price, 105.75)


class PortfolioViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username='test9999', password='12345')
        self.token = AccessToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_portfolio_list_view(self):
        response = self.client.get('/api/portfolio/portfolios/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class InvestmentViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username='test9999', password='12345')
        self.token = AccessToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.portfolio = Portfolio.objects.create(user=self.user, name='Test Portfolio')
        self.investment_data = {
            'portfolio': self.portfolio.id, 'symbol': 'AAPL', 'quantity': 10, 'transaction_type': 'BUY', 
            'date': '2024-02-15', 'price': 105.75
        }

    def test_create_investment(self):
        response = self.client.post('/api/portfolio/investments/', self.investment_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Investment.objects.count(), 1)
        self.assertEqual(Investment.objects.get().symbol, 'AAPL')

