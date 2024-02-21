from django.test import TestCase
from users.models import CustomUser
from .models import Portfolio, Stock, Transaction
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

class StockModelTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username='test9999', password='12345')
        self.portfolio = Portfolio.objects.create(user=self.user, name='Test Portfolio')
        self.stock = Stock.objects.create(portfolio=self.portfolio, symbol='AAPL', quantity=10, purchase_price=100.50)

    def test_stock_creation(self):
        self.assertEqual(self.stock.portfolio, self.portfolio)
        self.assertEqual(self.stock.symbol, 'AAPL')
        self.assertEqual(self.stock.quantity, 10)
        self.assertEqual(self.stock.purchase_price, 100.50)

class TransactionModelTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username='test9999', password='12345')
        self.portfolio = Portfolio.objects.create(user=self.user, name='Test Portfolio')
        self.stock = Stock.objects.create(portfolio=self.portfolio, symbol='AAPL', quantity=10, purchase_price=100.50)
        self.transaction = Transaction.objects.create(stock=self.stock, transaction_type='BUY', date=datetime.date(2024, 2, 15), price=105.75, quantity=5)

    def test_transaction_creation(self):
        self.assertEqual(self.transaction.stock, self.stock)
        self.assertEqual(self.transaction.transaction_type, 'BUY')
        self.assertEqual(self.transaction.date.strftime('%Y-%m-%d'), '2024-02-15')
        self.assertEqual(self.transaction.price, 105.75)
        self.assertEqual(self.transaction.quantity, 5)

class PortfolioViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username='test9999', password='12345')
        self.token = AccessToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_portfolio_list_view(self):
        response = self.client.get('/api/portfolio/portfolios/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class StockViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username='test9999', password='12345')
        self.token = AccessToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.portfolio = Portfolio.objects.create(user=self.user, name='Test Portfolio')
        self.stock_data = {'portfolio': self.portfolio.id, 'symbol': 'AAPL', 'quantity': 10, 'purchase_price': 100.50}

    def test_create_stock(self):
        response = self.client.post('/api/portfolio/stocks/', self.stock_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Stock.objects.count(), 1)
        self.assertEqual(Stock.objects.get().symbol, 'AAPL')

class TransactionViewSetTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username='test9999', password='12345')
        self.token = AccessToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        self.portfolio = Portfolio.objects.create(user=self.user, name='Test Portfolio')
        self.stock = Stock.objects.create(portfolio=self.portfolio, symbol='AAPL', quantity=10, purchase_price=100.50)
        self.transaction_data = {'stock': self.stock.id, 'transaction_type': 'BUY', 'date': '2024-02-15', 'price': 105.75, 'quantity': 5}

    def test_create_transaction(self):
        response = self.client.post('/api/portfolio/transactions/', self.transaction_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Transaction.objects.count(), 1)
        self.assertEqual(Transaction.objects.get().transaction_type, 'BUY')
