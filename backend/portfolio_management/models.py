from django.db import models
from users.models import CustomUser
from portfolio_management.utils import get_current_price
import uuid

class Portfolio(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

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
    price_difference_percentage = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)

    def calculate_price_difference_percentage(self):
        if self.transaction_type == 'Buy' and self.price and self.current_price:
            price_float = float(self.price)
            return ((float(self.current_price) - price_float) / price_float) * 100
        # elif self.transaction_type == 'Sell' and self.price and self.current_price:
        #     price_float = float(self.price)
        #     return ((price_float - float(self.current_price)) / price_float) * 100
        return None

    def save(self, *args, **kwargs):
        if self.current_price is None:
            current_price_obj = CurrentPrice.objects.filter(symbol=self.symbol).first()
            if current_price_obj:
                self.current_price = current_price_obj.price
            else:
                self.current_price = get_current_price(self.symbol)
                if self.current_price:
                    CurrentPrice.objects.update_or_create(symbol=self.symbol, defaults={'price': self.current_price})
        self.price_difference_percentage = self.calculate_price_difference_percentage()
        super().save(*args, **kwargs)

class CurrentPrice(models.Model):
    symbol = models.CharField(max_length=10, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.symbol}: {self.price}"