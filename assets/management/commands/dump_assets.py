import csv
import os

from django.conf import settings
from django.core.management.base import BaseCommand

from assets.models import Asset


def to_dict_for_csv(asset: Asset):
    return {
        'id': asset.id,
        'name': asset.name,
        'asset_type': asset.asset_types.all()[0].name,
        'asset_type_title': asset.asset_types.all()[0].title,
        'category': asset.category.name,
        'category_title': asset.category.title,
        'sensitive': asset.sensitive,
        'do_not_display': asset.do_not_display,
        'latitude': asset.location.latitude,
        'longitude': asset.location.longitude,
    }


class Command(BaseCommand):
    help = 'Dump assets from database to a CSV file'

    def handle(self, *args, **options):
        output_file = os.path.join(settings.BASE_DIR, 'asset_dump.csv');

        with open(output_file, 'w') as f:
            writer = csv.DictWriter(
                f,
                ['id',
                 'name',
                 'asset_type',
                 'asset_type_title',
                 'category',
                 'category_title',
                 'sensitive',
                 'do_not_display',
                 'latitude',
                 'longitude'],
            )
            writer.writeheader()
            for asset in Asset.objects.all():
                writer.writerow(to_dict_for_csv(asset))
