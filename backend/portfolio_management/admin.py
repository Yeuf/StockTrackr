from django.contrib import admin
from .models import Portfolio, Investment, CurrentPrice

admin.site.register(Portfolio)
admin.site.register(Investment)
admin.site.register(CurrentPrice)
