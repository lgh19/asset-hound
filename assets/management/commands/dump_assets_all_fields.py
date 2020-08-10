import csv
import os

from django.conf import settings
from django.core.management.base import BaseCommand

from assets.models import RawAsset, Asset


def to_dict_for_csv(asset: Asset):
    return {
        'id': asset.id,
        'name': asset.name,
        'asset_type': '|'.join([t.name for t in asset.asset_types.all()]),
        'raw_asset_ids': '|'.join([str(r.id) for r in asset.rawasset_set.all()]), # This is one field that differs from the RawAsset dump.
        'tags': '|'.join([t.name for t in asset.tags.all()]),
        'location_id': asset.location.id,
        'street_address': asset.location.street_address,
        'unit': asset.location.unit,
        'unit_type': asset.location.unit_type,
        'municipality': asset.location.municipality,
        'city': asset.location.city,
        'state': asset.location.state,
        'zip_code': asset.location.zip_code,
        'latitude': asset.location.latitude,
        'longitude': asset.location.longitude,
        'parcel_id': asset.location.parcel_id,
        'residence': asset.location.residence,
        'iffy_geocoding': asset.location.iffy_geocoding,
        'available_transportation': asset.location.available_transportation,
        'parent_location': asset.location.parent_location,
        'url': asset.url,
        'email': asset.email,
        'phone': asset.phone,
        'hours_of_operation': asset.hours_of_operation,
        'holiday_hours_of_operation': asset.holiday_hours_of_operation,
        'periodicity': asset.periodicity,
        'capacity': asset.capacity,
        'wifi_network': asset.wifi_network,
        'internet_access': asset.internet_access,
        'computers_available': asset.computers_available,
        'accessibility': asset.accessibility,
        'open_to_public': asset.open_to_public,
        'child_friendly': asset.child_friendly,
        'localizability': asset.localizability,
        'sensitive': asset.sensitive,
        'do_not_display': asset.do_not_display,
        'services': '|'.join([s.name for s in asset.services.all()]),
        'hard_to_count_population': '|'.join([p.name for p in asset.hard_to_count_population.all()]),
        'data_source_name': asset.data_source.name,
        'data_source_url': asset.data_source.url,
        'organization_name': asset.organization.name,
        'organization_phone': asset.organization.phone,
        'organization_email': asset.organization.email,
        'etl_notes': asset.etl_notes,
        #'primary_key_from_rocket': asset.primary_key_from_rocket,
        #'synthesized_key': asset.synthesized_key,
        'geocoding_properties': asset.location.geocoding_properties,
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
                 'raw_asset_ids', # Replaces asset_id in raw asset dump.
                 'tags',
                 'location_id', # Not present in raw asset dump.
                 'street_address',
                 'unit',
                 'unit_type',
                 'municipality',
                 'city',
                 'state',
                 'zip_code',
                 'latitude',
                 'longitude',
                 'parcel_id',
                 'residence',
                 'iffy_geocoding',
                 'available_transportation',
                 'parent_location',
                 'url',
                 'email',
                 'phone',
                 'hours_of_operation',
                 'holiday_hours_of_operation',
                 'periodicity',
                 'capacity',
                 'wifi_network',
                 'internet_access',
                 'computers_available',
                 'accessibility',
                 'open_to_public',
                 'child_friendly',
                 'sensitive',
                 'do_not_display',
                 'localizability',
                 'services',
                 'hard_to_count_population',
                 'data_source_name',
                 'data_source_url',
                 'organization_name',
                 'organization_phone',
                 'organization_email',
                 'etl_notes',
                 #'primary_key_from_rocket', # Excluded from asset dump.
                 #'synthesized_key', # Excluded from asset dump.
                 'geocoding_properties',
                 ],
            )
            writer.writeheader()
            for k,asset in enumerate(assets_iterator.iterator()): # Use the "iterator()" method to lazily evaluate the query in chunks (to save memory)
                writer.writerow(to_dict_for_csv(asset))
                if k % 2000 == 2000-1:
                    print(f"Wrote {k+1} raw assets so far.")
