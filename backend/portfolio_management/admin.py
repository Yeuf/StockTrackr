from django.contrib import admin
from .models import Portfolio, Stock, Transaction

admin.site.register(Portfolio)
admin.site.register(Stock)
admin.site.register(Transaction)
