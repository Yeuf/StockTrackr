from rest_framework import viewsets
from rest_framework.decorators import action, permission_classes, api_view
from django.core.management import call_command
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Portfolio, Holding, Investment, MonthlyPerformance
from .serializers import PortfolioSerializer, HoldingSerializer, InvestmentSerializer, MonthlyPerformanceSerializer

@permission_classes([IsAuthenticated])
class PortfolioViewSet(viewsets.ModelViewSet):
    serializer_class = PortfolioSerializer
    basename = 'portfolio'
    def get_queryset(self):
        user = self.request.user
        return Portfolio.objects.filter(user=user)
    
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
    
    @action(detail=True, methods=['get'])
    def monthly_performance_by_portfolio(self, request, pk=None):
        portfolio = Portfolio.objects.get(pk=pk)
        monthly_performance = MonthlyPerformance.objects.filter(portfolio=portfolio)
        serializer = MonthlyPerformanceSerializer(monthly_performance, many=True)
        return Response(serializer.data)

@api_view(['POST'])
def update_current_prices(request):
    try:
        call_command('update_current_price') 
        return Response({'success': True})
    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=500)
