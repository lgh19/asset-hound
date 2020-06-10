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
    help = 'Dump assets to a CSV file, with the option to specify one or more asset types as command-line arguments.\n\nUsage:\n> python manage.py dump_assets_by_type <asset_type>'

    def add_arguments(self, parser): # Necessary boilerplate for accessing args.
        parser.add_argument('args', nargs='*')

    def handle(self, *args, **options):

        filename = 'asset_dump.csv'
        if len(args) == 0:
            print("Dumping all assets.")
            assets_iterator = Asset.objects.all()
        elif len(args) == 1:
            chosen_asset_types = args
            print(f"Dumping just the assets of type {chosen_asset_types[0]}.")
            assets_iterator = Asset.objects.filter(asset_types__name = chosen_asset_types[0])
            filename = f'asset_dump_{chosen_asset_types[0]}.csv'
        else:
            chosen_asset_types = args
            print(f"Dumping just the assets of these types: {chosen_asset_types}")
            raise ValueError("Still need to implement filtering of assets to multiple types.")
            
        output_file = os.path.join(settings.BASE_DIR, filename)

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
            rows = []
            for asset in assets_iterator:
                rows.append(to_dict_for_csv(asset))

            writer.writerows(rows)
