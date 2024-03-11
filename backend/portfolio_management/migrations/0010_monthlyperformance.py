# Generated by Django 5.0.2 on 2024-03-11 11:31

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portfolio_management', '0009_portfolio_performance'),
    ]

    operations = [
        migrations.CreateModel(
            name='MonthlyPerformance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('performance', models.DecimalField(decimal_places=2, max_digits=10)),
                ('month', models.IntegerField()),
                ('year', models.IntegerField()),
                ('portfolio', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='portfolio_management.portfolio')),
            ],
            options={
                'unique_together': {('portfolio', 'month', 'year')},
            },
        ),
    ]
