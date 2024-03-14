from rest_framework import viewsets
from rest_framework.decorators import action, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Portfolio, Holding, Investment
from .serializers import PortfolioSerializer, HoldingSerializer, InvestmentSerializer

@permission_classes([IsAuthenticated])
class PortfolioViewSet(viewsets.ModelViewSet):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer
    
@permission_classes([IsAuthenticated])
class InvestmentViewSet(viewsets.ModelViewSet):
    queryset = Investment.objects.all()
    serializer_class = InvestmentSerializer

    @action(detail=True, methods=['get'])
    def holdings_by_portfolio(self, request, pk=None):
        portfolio = Portfolio.objects.get(pk=pk)
        holdings = Holding.objects.filter(portfolio=portfolio)
        serializer = HoldingSerializer(holdings, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def investments_by_portfolio(self, request, pk=None):
        portfolio = Portfolio.objects.get(pk=pk)
        investments = Investment.objects.filter(portfolio=portfolio)
        serializer = InvestmentSerializer(investments, many=True)
        return Response(serializer.data)
