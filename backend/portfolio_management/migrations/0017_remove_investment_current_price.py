# Generated by Django 5.0.2 on 2024-03-13 08:57

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio_management', '0016_investment_current_price'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='investment',
            name='current_price',
        ),
    ]
