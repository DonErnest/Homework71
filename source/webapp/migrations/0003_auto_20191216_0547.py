# Generated by Django 2.2.7 on 2019-12-16 05:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0002_auto_20191212_1321'),
    ]

    operations = [
        migrations.AlterField(
            model_name='quote',
            name='status',
            field=models.CharField(choices=[('new', 'новая'), ('checked', 'проверена')], default='new', max_length=10, verbose_name='Статус'),
        ),
    ]
