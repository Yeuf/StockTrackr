from django.core.management.base import BaseCommand
from portfolio_management.models import Investment, CurrentPrice, Holding
from portfolio_management.utils import get_current_price

class Command(BaseCommand):
    help = 'Updates the current prices of investments from external API'

    def handle(self, *args, **options):
        symbols = set(Investment.objects.values_list('symbol', flat=True))
        for symbol in symbols:
            current_price = get_current_price(symbol)
            if current_price is not None:
                CurrentPrice.objects.update_or_create(symbol=symbol, defaults={'price': current_price})
                self.stdout.write(self.style.SUCCESS(f"Updated price for {symbol}"))
                
                investments = Investment.objects.filter(symbol=symbol)
                for investment in investments:
                    investment.current_price = current_price
                    investment.save()
                
                holdings = Holding.objects.filter(symbol=symbol)
                for holding in holdings:
                    holding.current_price = current_price
                    holding.save()
                    
            else:
                self.stdout.write(self.style.WARNING(f"Failed to update price for {symbol}"))
