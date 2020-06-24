import csv
import os

from django.conf import settings
from django.core.management.base import BaseCommand

from assets.models import Asset


def to_dict_for_csv(asset: Asset, for_carto=False):
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

    def add_arguments(self, parser):
        # Named (optional) arguments
        parser.add_argument(
            '-t',
            '--asset-types',
            nargs='*',
            help='Specify which asset types to filter by',
        )
        parser.add_argument(
            '-c'
            '--carto',
            action='store_true',
            help='Dump with geom fields for carto.',
        )

    def handle(self, *args, **options):
        output_file = os.path.join(settings.BASE_DIR, 'asset_dump.csv')
        asset_types = options['asset-types']
        for_carto = options['carto']

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
            asset_set = Asset.objects.all() if not asset_types else Asset.objects.filter(
                asset_types__name__in=asset_types)
            for asset in asset_set:
                writer.writerow(to_dict_for_csv(asset, for_carto=for_carto))
