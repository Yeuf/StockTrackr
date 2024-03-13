from django.db import models
from django.core.exceptions import ValidationError
from users.models import CustomUser
from .utils import get_current_price
import uuid


def get_current_price_for_symbol(symbol):
    current_price_obj = CurrentPrice.objects.filter(symbol=symbol).first()
    if current_price_obj:
        return current_price_obj.price
    else:
        return get_current_price(symbol)


class Portfolio(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    performance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    current_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def update_performance(self):
        holdings = self.holding_set.all()
        total_investment_value = sum(holding.quantity * holding.purchase_price for holding in holdings)
        if total_investment_value == 0:
            return

        total_performance = sum(holding.quantity * holding.current_price for holding in holdings)
        percentage_difference = ((total_performance - total_investment_value) / total_investment_value) * 100
        self.current_value = total_performance
        self.performance = percentage_difference
        self.save()


class Holding(models.Model):
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
    symbol = models.CharField(max_length=10)
    quantity = models.IntegerField()
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    purchase_date = models.DateField()
    current_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    performance = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)

    @classmethod
    def update_quantity(cls, portfolio, symbol, quantity_change, purchase_price=None, purchase_date=None):
        if quantity_change > 0:
            # Buying transaction: Update or create holding
            holding, created = cls.objects.get_or_create(
                portfolio=portfolio,
                symbol=symbol,
                purchase_price=purchase_price,
                purchase_date=purchase_date,
                defaults={'quantity': quantity_change}
            )
            if not created:
                holding.quantity += quantity_change
                holding.save()
        else:
            # Selling transaction: Handle quantity update
            holdings = cls.objects.filter(portfolio=portfolio, symbol=symbol).order_by('purchase_date')
            total_holding_quantity = sum(holding.quantity for holding in holdings)
            if total_holding_quantity >= abs(quantity_change):
                # Sufficient quantity available in holdings for selling
                quantity_remaining = -quantity_change
                for holding in holdings:
                    if quantity_remaining <= 0:
                        break
                    if holding.quantity >= quantity_remaining:
                        holding.quantity -= quantity_remaining
                        if holding.quantity == 0:
                            holding.delete()
                        else:
                            holding.save()
                        quantity_remaining = 0
                    else:
                        quantity_remaining -= holding.quantity
                        holding.delete()
                if quantity_remaining > 0:
                    # If there is remaining quantity, create or update other holdings
                    cls.objects.create(portfolio=portfolio, symbol=symbol, quantity=quantity_remaining)
            else:
                # Insufficient quantity available in holdings for selling
                raise ValueError("Insufficient quantity available in holdings for selling")

    def calculate_price_difference_percentage(self):
        if self.purchase_price and self.current_price:
            total_price = self.quantity * self.purchase_price
            total_current_price = self.quantity * self.current_price
            return ((total_current_price - total_price) / total_price) * 100
        return None

    def save(self, *args, **kwargs):
        if self.current_price is None:
            self.current_price = get_current_price_for_symbol(self.symbol)
        self.performance = self.calculate_price_difference_percentage()
        super().save(*args, **kwargs)
        self.portfolio.update_performance()


class Investment(models.Model):
    TRANSACTION_CHOICES = (
        ('Buy', 'Buy'),
        ('Sell', 'Sell'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
    symbol = models.CharField(max_length=10)
    quantity = models.IntegerField()
    transaction_type = models.CharField(max_length=4, choices=TRANSACTION_CHOICES)
    date = models.DateField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    current_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    def save(self, *args, **kwargs):

        if self.transaction_type == 'Buy':
            Holding.update_quantity(self.portfolio, self.symbol, self.quantity, self.price, self.date)
        elif self.transaction_type == 'Sell':
            try:
                Holding.update_quantity(self.portfolio, self.symbol, -self.quantity, self.price, self.date)
            except ValueError as e:
                self.full_clean()
                raise ValidationError({'quantity': [str(e)]})
        
        super().save(*args, **kwargs)

        self.portfolio.update_performance()


class CurrentPrice(models.Model):
    symbol = models.CharField(max_length=10, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.symbol}: {self.price}"


class MonthlyPerformance(models.Model):
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
    value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    performance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    month = models.IntegerField()
    year = models.IntegerField()

    class Meta:
        unique_together = ['portfolio', 'month', 'year']
