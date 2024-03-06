from django.db import models
from users.models import CustomUser
import uuid

class Portfolio(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

class Investment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
    symbol = models.CharField(max_length=10)
    quantity = models.IntegerField()
    transaction_type = models.CharField(max_length=4)  # 'BUY' or 'SELL'
    date = models.DateField()
    price = models.DecimalField(max_digits=10, decimal_places=2)