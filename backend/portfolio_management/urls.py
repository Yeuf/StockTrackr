from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PortfolioViewSet, InvestmentViewSet, update_current_prices

router = DefaultRouter()
router.register(r'portfolios', PortfolioViewSet, basename='portfolio')
router.register(r'investments', InvestmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('investments/<uuid:pk>/investments_by_portfolio/', InvestmentViewSet.as_view({'get': 'investments_by_portfolio'}), name='investments-by-portfolio'),
    path('update_current_prices/', update_current_prices, name='update-current-prices'),
]