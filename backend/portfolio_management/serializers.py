from rest_framework import serializers
from .models import Portfolio, Investment, Holding

class HoldingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Holding
        fields = ['symbol', 'quantity', 'purchase_price', 'purchase_date', 'current_price', 'performance']

class PortfolioSerializer(serializers.ModelSerializer):

    class Meta:
        model = Portfolio
        fields = ['id', 'name', 'current_value', 'performance']
        extra_kwargs = {'id': {'read_only': True}}

    def create(self, validated_data):
        user = self.context['request'].user
        
        if user.is_authenticated:
            validated_data['user'] = user
            return super().create(validated_data)
        else:
            raise serializers.ValidationError("User must be authenticated to create a portfolio.")

class InvestmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Investment
        fields = '__all__'
        extra_kwargs = {'id': {'read_only': True}, 'portfolio': {'write_only': True}}
