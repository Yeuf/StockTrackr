from rest_framework import serializers
from .models import Portfolio, Investment
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

class InvestmentSerializer(serializers.ModelSerializer):
    portfolio_name = serializers.CharField(source='portfolio.name', read_only=True)
    current_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    price_difference_percentage = serializers.DecimalField(max_digits=5, decimal_places=2, read_only=True)

    class Meta:
        model = Investment
        fields = '__all__'
        extra_kwargs = {'id': {'read_only': True}, 'portfolio': {'write_only': True}}
        