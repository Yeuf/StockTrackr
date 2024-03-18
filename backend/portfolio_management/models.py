from django.db import models, transaction
from django.db.models import Sum, F, DecimalField
from django.core.exceptions import ValidationError
from users.models import CustomUser
from .utils import get_current_price
import uuid
from decimal import Decimal


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
    capital_gain = models.DecimalField(max_digits=10, decimal_places=2, default=0)


    def update_performance(self):
        total_investment_value = self.holding_set.aggregate(
            total_investment_value=Sum(F('quantity') * F('purchase_price'), output_field=DecimalField())
        )['total_investment_value'] or Decimal('0')

        if total_investment_value == Decimal('0'):
            return

        total_performance = self.holding_set.aggregate(
            total_performance=Sum(F('quantity') * F('current_price'), output_field=DecimalField())
        )['total_performance'] or Decimal('0')

        percentage_difference = ((total_performance - total_investment_value) / total_investment_value) * Decimal('100')
        self.current_value = total_performance
        self.capital_gain = total_performance - total_investment_value
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
    capital_gain = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    @classmethod
    def update_quantity(cls, portfolio, symbol, quantity_change, purchase_price=None, purchase_date=None):
        with transaction.atomic():
            if quantity_change > 0:
                holding, created = cls.objects.update_or_create(
                    portfolio=portfolio,
                    symbol=symbol,
                    purchase_price=purchase_price,
                    purchase_date=purchase_date,
                    defaults={'quantity': quantity_change}
                )
                if not created:
                    holding.quantity = F('quantity') + quantity_change
                    holding.save(update_fields=['quantity'])
            else:
                holdings = cls.objects.filter(portfolio=portfolio, symbol=symbol).order_by('purchase_date')
                total_holding_quantity = sum(holding.quantity for holding in holdings)
                
                if total_holding_quantity < abs(quantity_change):
                    raise ValidationError("Insufficient quantity available in holdings for selling")

                quantity_to_sell = abs(quantity_change)
            
                for holding in holdings:
                    if quantity_to_sell <= 0:
                        break
                    if holding.quantity >= quantity_to_sell:
                        holding.quantity -= quantity_to_sell
                        if holding.quantity == 0:
                            holding.delete()
                        else:
                            holding.save()
                        quantity_to_sell = 0
                    else:
                        quantity_to_sell -= holding.quantity
                        holding.delete()


    def calculate_performance(self):
        if self.purchase_price and self.current_price:
            decimal_purchase_price = Decimal(self.purchase_price)
            decimal_current_price = Decimal(self.current_price)
            total_price = self.quantity * decimal_purchase_price
            total_current_price = self.quantity * decimal_current_price
            capital_gain = total_current_price - total_price
            performance = ((total_current_price - total_price) / total_price) * Decimal('100')
            return capital_gain, performance
        return None
    

    def save(self, *args, **kwargs):
        if self.current_price is None:
            self.current_price = get_current_price_for_symbol(self.symbol)
        self.capital_gain, self.performance = self.calculate_performance()
        super().save(*args, **kwargs)
        self.portfolio.update_performance()


class Investment(models.Model):
    TRANSACTION_CHOICES = (
        ('Buy', 'Buy'),
        ('Sell', 'Sell'),
    )
    CURRENCY_CHOICES = (
        ('USD', 'USD'),
        ('EUR', 'EUR'),
        ('CAD', 'CAD'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
    symbol = models.CharField(max_length=10)
    quantity = models.IntegerField()
    transaction_type = models.CharField(max_length=4, choices=TRANSACTION_CHOICES)
    date = models.DateField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES)

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
    capital_gain = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    performance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    month = models.IntegerField()
    year = models.IntegerField()

    class Meta:
        unique_together = ['portfolio', 'month', 'year']

