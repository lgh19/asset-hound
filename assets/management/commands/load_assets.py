import csv
import os
import re
import sys  # This is a workaround for an error that

import phonenumbers
from django.conf import settings
from django.core.management.base import BaseCommand

from assets.models import (Asset,
                           Organization,
                           Location,
                           AssetType,
                           Tag,
                           AccessibilityFeature,
                           ProvidedService,
                           TargetPopulation,
                           DataSource)

csv.field_size_limit(sys.maxsize)  # looks like this:


# _csv.Error: field larger than field limit (131072)

def parse_cell(cell):
    return cell.split('|')


def get_localizability(l):
    return l[:3].upper()


def boolify(x):
    if x in [None, '']:
        return None
    return x.lower() == 'true'


def value_or_none(row, field):
    return row[field] if field in row else None


def type_or_none(row, field, desired_type):
    """This function tries to cast the value of row[field] to
    the passed desired type (e.g, float or int). If it fails,
    it returns None.

    Note that this does not yet support fields like
    PhoneNumberField, URLField, and EmailField."""
    if field in row:
        try:
            return desired_type(row[field])
        except ValueError:
            return None
    return None


def standardize_phone(phone: str):
    result_number = None
    try:
        candidate_phone = '+1' + re.sub(r'\D', '', phone) # This actually adds a leading '+1'
        # even if the phone number already starts with a 1, but the phonenumbers.parse function is
        phone_number = phonenumbers.parse(candidate_phone) # able to correct this.
        if phonenumbers.is_valid_number(phone_number):
            result_number = f'+{phone_number.country_code}{phone_number.national_number}'
    except Exception as e: # This is complaining for unknown reasons about what appear to be valid phone numbers.
        print(e)
    print(result_number)
    return result_number


class Command(BaseCommand):
    help = 'Loads assets from a CSV file, which may be specified by a command-line argument.'

    def add_arguments(self, parser): # Necessary boilerplate for accessing args.
        parser.add_argument('args', nargs='*')

    def handle(self, *args, **options):

        if len(args) == 0:
            file_name = os.path.join(settings.BASE_DIR, 'update.csv')
        else:
            file_name = os.path.join(settings.BASE_DIR, args[0])

        with open(file_name) as f:
            dr = csv.DictReader(f)
            for row in dr:
                # get or create a new org
                organization = Organization.objects.get_or_create(
                    name=value_or_none(row, 'organization_name'),
                    defaults={
                        'email': value_or_none(row, 'organization_email'),
                        'phone': standardize_phone(row['organization_phone'])
                    }
                )[0]
                location = Location.objects.get_or_create(
                    street_address=value_or_none(row, 'street_address'),
                    city=value_or_none(row, 'city'),
                    state=value_or_none(row, 'state'),
                    zip_code=value_or_none(row, 'zip_code'),
                    defaults={
                        'available_transportation': value_or_none(row, 'location_transportation'),
                        'latitude': type_or_none(row, 'latitude', float),
                        'longitude': type_or_none(row, 'longitude', float),
                        'parcel_id': value_or_none(row, 'parcel_id'),
                        'residence': boolify(value_or_none(row, 'residence')),
                    }
                )[0]

                asset_types = [AssetType.objects.get_or_create(name=asset_type)[0] for asset_type in
                               parse_cell(row['asset_type'])] if row['asset_type'] else []

                tags = [Tag.objects.get_or_create(name=tag)[0] for tag in
                        parse_cell(row['tags'])] if row['tags'] else []

                accessibility_features = [AccessibilityFeature.objects.get_or_create(name=access)[0] for access in
                                          parse_cell(row['accessibility'])] if row['accessibility'] else []

                services = [ProvidedService.objects.get_or_create(name=service)[0] for service in
                            parse_cell(row['services'])] if 'services' in row else []

                hard_to_count_pops = [TargetPopulation.objects.get_or_create(name=pop)[0] for pop in
                                      parse_cell(row['hard_to_count_population'])] \
                    if 'hard_to_count_population' in row else []

                data_source = DataSource.objects.get_or_create(
                    name=value_or_none(row, 'data_source_name'),
                    defaults={'url': row['data_source_url']})[0] if row['data_source_name'] else None

                asset = Asset.objects.create(
                    name=value_or_none(row, 'name'),
                    localizability=get_localizability(value_or_none(row, 'localizability')),

                    url=value_or_none(row, 'url'),
                    email=value_or_none(row, 'email'),
                    phone=standardize_phone(row['phone']),

                    hours_of_operation=value_or_none(row, 'hours_of_operation'),
                    holiday_hours_of_operation=value_or_none(row, 'holiday_hours_of_operation'),
                    periodicity=value_or_none(row, 'periodicity'),
                    capacity=type_or_none(row, 'capacity', int),
                    wifi_network=value_or_none(row, 'wifi_network'),

                    etl_notes=value_or_none(row, 'notes'),

                    child_friendly=boolify(value_or_none(row, 'child_friendly')),
                    internet_access=boolify(value_or_none(row, 'internet_access')),
                    computers_available=boolify(value_or_none(row, 'computers_available')),
                    open_to_public=boolify(value_or_none(row, 'open_to_public')),
                    sensitive=boolify(value_or_none(row, 'sensitive')),
                    do_not_display=boolify(value_or_none(row, 'do_not_display')),

                    location=location,
                    organization=organization,
                    data_source=data_source,
                    primary_key_from_rocket=value_or_none(row, 'primary_key_from_rocket'),
                    synthesized_key=value_or_none(row, 'synthesized_key'),
                )

                asset.asset_types.set(asset_types)
                asset.tags.set(tags)
                asset.services.set(services)
                asset.accessibility_features.set(accessibility_features)
                asset.hard_to_count_population.set(hard_to_count_pops)
                asset.save()
                print('Created', asset)
