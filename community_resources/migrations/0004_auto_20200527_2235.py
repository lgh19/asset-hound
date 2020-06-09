# Generated by Django 3.0.4 on 2020-05-27 22:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assets', '0011_auto_20200519_1827'),
        ('community_resources', '0003_auto_20200521_1533'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='resource',
            options={'ordering': ('priority',)},
        ),
        migrations.AlterModelOptions(
            name='resourcecategory',
            options={'verbose_name_plural': 'Resource Categories'},
        ),
        migrations.AlterField(
            model_name='resource',
            name='assets',
            field=models.ManyToManyField(blank=True, related_name='resources', to='assets.Asset'),
        ),
        migrations.AlterField(
            model_name='resource',
            name='other_locations',
            field=models.ManyToManyField(blank=True, related_name='resources', to='assets.Location'),
        ),
    ]
