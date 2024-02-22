from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PortfolioViewSet, InvestmentViewSet

router = DefaultRouter()
router.register(r'portfolios', PortfolioViewSet)
router.register(r'investments', InvestmentViewSet)

urlpatterns = router.urls