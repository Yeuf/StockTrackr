from django.test import TestCase
from django.utils import timezone
from django.core.exceptions import ValidationError
from users.models import CustomUser
from .models import Portfolio, Holding, Investment, CurrentPrice, MonthlyPerformance

class PortfolioTestCase(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username="testuser", password="testpassword")
        self.portfolio = Portfolio.objects.create(user=self.user, name="Test Portfolio")

    def test_update_performance(self):
        self.portfolio.update_performance()
        self.assertEqual(self.portfolio.performance, 0)
        self.assertEqual(self.portfolio.current_value, 0)

        holding = Holding.objects.create(
            portfolio=self.portfolio,
            symbol='AAPL',
            quantity=10,
            purchase_price=100,
            purchase_date=timezone.now().date(),
            current_price=110
        )
        self.portfolio.update_performance()
        self.assertEqual(self.portfolio.performance, 10)
        self.assertEqual(self.portfolio.current_value, 1100)


class InvestmentTestCase(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username="testuser", password="testpassword")
        self.portfolio = Portfolio.objects.create(user=self.user, name="Test Portfolio")

    def test_buy_investment(self):
        Investment.objects.create(
            portfolio=self.portfolio,
            symbol='AAPL',
            quantity=5,
            transaction_type='Buy',
            date=timezone.now().date(),
            price=110
        )
        holding = self.portfolio.holding_set.filter(symbol='AAPL').first()
        self.assertEqual(holding.quantity, 5)

    def test_sell_investment(self):
        Holding.objects.create(
            portfolio=self.portfolio,
            symbol='AAPL',
            quantity=10,
            purchase_price=100,
            purchase_date=timezone.now().date(),
            current_price=110
        )
        Investment.objects.create(
            portfolio=self.portfolio,
            symbol='AAPL',
            quantity=3,
            transaction_type='Sell',
            date=timezone.now().date(),
            price=120
        )
        holding = self.portfolio.holding_set.filter(symbol='AAPL').first()
        self.assertEqual(holding.quantity, 7)

        with self.assertRaises(ValidationError):
            Investment.objects.create(
                portfolio=self.portfolio,
                symbol='AAPL',
                quantity=8,
                transaction_type='Sell',
                date=timezone.now().date(),
                price=120
            )


class CurrentPriceTestCase(TestCase):
    def test_current_price_str(self):
        current_price = CurrentPrice.objects.create(symbol='AAPL', price=110)
        self.assertEqual(str(current_price), 'AAPL: 110')

class MonthlyPerformanceTestCase(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(username="testuser", password="testpassword")
        self.portfolio = Portfolio.objects.create(user=self.user, name="Test Portfolio")

    def test_create_monthly_performance(self):
        MonthlyPerformance.objects.create(
            portfolio=self.portfolio,
            value=1000,
            performance=10,
            month=1,
            year=2024
        )
        self.assertTrue(MonthlyPerformance.objects.filter(portfolio=self.portfolio, month=1, year=2024).exists())

    def test_unique_together_constraint(self):
        MonthlyPerformance.objects.create(
            portfolio=self.portfolio,
            value=1000,
            performance=10,
            month=1,
            year=2023
        )
        with self.assertRaises(Exception):
            MonthlyPerformance.objects.create(
                portfolio=self.portfolio,
                value=1500,
                performance=15,
                month=1,
                year=2023
            )

    def test_update_monthly_performance(self):
        MonthlyPerformance.objects.create(
            portfolio=self.portfolio,
            value=1000,
            performance=10,
            month=1,
            year=2024
        )
        monthly_performance = MonthlyPerformance.objects.get(portfolio=self.portfolio, month=1, year=2024)
        monthly_performance.value = 1200
        monthly_performance.performance = 20
        monthly_performance.save()

        updated_monthly_performance = MonthlyPerformance.objects.get(portfolio=self.portfolio, month=1, year=2024)
        self.assertEqual(updated_monthly_performance.value, 1200)
        self.assertEqual(updated_monthly_performance.performance, 20)

