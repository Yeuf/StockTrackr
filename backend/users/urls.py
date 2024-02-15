from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('signup', views.signup, name='signup'),
    path('login', views.login, name='login'),
    path('test_token', views.test_token, name='test_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh')
]