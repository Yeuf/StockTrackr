from rest_framework import serializers
from .models import Portfolio, Stock, Transaction
from rest_framework import exceptions
import uuid


class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ['id', 'name']
        extra_kwargs = {'id': {'read_only': True}}
    def create(self, validated_data):
        user = self.context['request'].user
        
        if user.is_authenticated:
            validated_data['user'] = user
            validated_data['id'] = uuid.uuid4()
            return super().create(validated_data)
        else:
            raise exceptions.PermissionDenied("User must be authenticated to create a portfolio.")

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'