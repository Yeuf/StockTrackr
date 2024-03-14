from django.core.management.base import BaseCommand
from portfolio_management.models import Portfolio, MonthlyPerformance
from datetime import datetime

class Command(BaseCommand):
    help = 'Saves the monthly performance for all portfolios'

    def handle(self, *args, **kwargs):
        current_month = datetime.now().month
        current_year = datetime.now().year

        for portfolio in Portfolio.objects.all():
            monthly_performance, created = MonthlyPerformance.objects.get_or_create(
                portfolio=portfolio,
                month=current_month,
                year=current_year
            )
            monthly_performance.value = portfolio.current_value
            monthly_performance.capital_gain = portfolio.capital_gain
            monthly_performance.performance = portfolio.performance
            monthly_performance.save()

        self.stdout.write(self.style.SUCCESS('Monthly performance saved successfully'))
