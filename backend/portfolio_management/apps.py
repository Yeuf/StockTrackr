from django.apps import AppConfig


class PortfolioManagementConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'portfolio_management'

    def ready(self):
        import portfolio_management.signals
