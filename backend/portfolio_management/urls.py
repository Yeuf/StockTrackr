from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PortfolioViewSet, StockViewSet, TransactionViewSet

router = DefaultRouter()
router.register(r'portfolios', PortfolioViewSet)
router.register(r'stocks', StockViewSet)
router.register(r'transactions', TransactionViewSet)

urlpatterns = router.urls