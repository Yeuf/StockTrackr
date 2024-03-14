from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Portfolio, MonthlyPerformance
from decimal import Decimal
from datetime import datetime


@receiver(post_save, sender=Portfolio)
def create_monthly_performance(sender, instance, created, **kwargs):
    if created:
        month = datetime.now().month
        year = datetime.now().year
        MonthlyPerformance.objects.create(
            portfolio=instance,
            value=Decimal('0'),
            capital_gain=Decimal('0'),
            performance=Decimal('0'),
            month=month,
            year=year
        )