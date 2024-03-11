from django.contrib import admin
from .models import Portfolio, Investment, CurrentPrice, MonthlyPerformance, Holding

admin.site.register(Portfolio)
admin.site.register(Investment)
admin.site.register(Holding)
admin.site.register(CurrentPrice)
admin.site.register(MonthlyPerformance)
