# Generated by Django 5.0.2 on 2024-03-11 11:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio_management', '0008_currentprice'),
    ]

    operations = [
        migrations.AddField(
            model_name='portfolio',
            name='performance',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
    ]
