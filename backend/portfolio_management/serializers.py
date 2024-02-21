from rest_framework import serializers
from .models import Portfolio, Stock, Transaction

class PortfolioSerializer(serializers.ModelSerializer):
    # user = serializers.PrimaryKeyRelatedField(default=serializers.CurrentUserDefault(), read_only=True)
    
    class Meta:
        model = Portfolio
        fields = '__all__'

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'