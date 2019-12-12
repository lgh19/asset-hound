import csv
import os
import re

from django.conf import settings
from django.core.management.base import BaseCommand

from assets.models import (Asset,
                           Organization,
                           Location,
                           AssetType,
                           AccessibilityFeature,
                           ProvidedService,
                           TargetPopulation,
                           DataSource)


def parse_cell(cell):
    return cell.split('|')


def get_localizability(l):
    return l[:3].upper()


def boolify(x):
    return x.lower == 'true'


class Command(BaseCommand):
    help = 'Loads assets from csv'

    def handle(self, *args, **options):
        file_name = os.path.join(settings.BASE_DIR, 'assets.csv');
        with open(file_name) as f:
            dr = csv.DictReader(f)
            for row in dr:
                # get or create a new org
                organization = Organization.objects.get_or_create(
                    name=row['organization_name'],
                    defaults={
                        'email': row['organization_email'],
                        'phone': row['organization_phone']
                    }
                )[0]
                location = Location.objects.get_or_create(
                    street_address=row['street_address'],
                    city=row['city'],
                    state=row['state'],
                    zip_code=row['zip_code'],
                    defaults={
                        'available_transportation': row['location_transportation'],
                        'latitude': row['latitude'],
                        'longitude': row['longitude']
                    }
                )[0]

                asset_types = [AssetType.objects.get_or_create(name=asset_type)[0] for asset_type in
                               parse_cell(row['asset_type'])] if row['asset_type'] else []

                accessibility_features = [AccessibilityFeature.objects.get_or_create(name=access)[0] for access in
                                          parse_cell(row['accessibility'])] if row['accessibility'] else []

                services = [ProvidedService.objects.get_or_create(name=service)[0] for service in
                            parse_cell(row['services'])] if row['services'] else []

                hard_to_count_pops = [TargetPopulation.objects.get_or_create(name=pop)[0] for pop in
                                      parse_cell(row['hard_to_count_population'])] \
                    if row['hard_to_count_population'] else []

                data_source = DataSource.objects.get_or_create(
                    name=row['data_source_name'],
                    defaults={'url': row['data_source_url']})[0] if row['data_source_name'] else None

                asset = Asset.objects.create(
                    name=row['name'],
                    localizability=get_localizability(row['localizability']),

                    url=row['url'],
                    email=row['email'],
                    phone='+1' + re.sub(r'\D', '', row['phone']) if row['phone'] else None,

                    hours_of_operation=row['hours_of_operation'],
                    holiday_hours_of_operation=row['holiday_hours_of_operation'],
                    capacity=row['capacity'] if row['capacity'] else None,
                    wifi_network=row['wifi_network'],

                    child_friendly=boolify(row['child_friendly']),
                    internet_access=boolify(row['internet_access']),
                    computers_available=boolify(row['computers_available']),
                    open_to_public=boolify(row['open_to_public']),
                    sensitive=boolify(row['sensitive']),

                    location=location,
                    organization=organization,
                    data_source=data_source
                )
                asset.asset_types.set(asset_types)
                asset.services.set(services)
                asset.accessibility_features.set(accessibility_features)
                asset.hard_to_count_population.set(hard_to_count_pops)
                asset.save()
                print('Created', asset)
