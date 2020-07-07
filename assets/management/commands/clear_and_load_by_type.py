import csv
import os
import re
import sys  # This is a workaround for an error that
csv.field_size_limit(sys.maxsize)  # looks like this:
# _csv.Error: field larger than field limit (131072)

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

from assets.management.commands.load_assets import parse_cell, get_localizability, boolify, standardize_phone

from pprint import pprint

def non_blank_value_or_none(row, field):
    """If the field is in the row dict, return the value (unless it's an empty
    string, which gets coerced to None).
    Otherwise return None."""
    return row[field] if (field in row and row[field] != '') else None

def non_blank_type_or_none(row, field, desired_type):
    """This function tries to cast the value of row[field] to
    the passed desired type (e.g, float or int). If it fails,
    or if the passed value is an empty string (which is how
    None values are passed by CSVs), it returns None.

    Note that this does not yet support fields like
    PhoneNumberField, URLField, and EmailField."""
    if field in row:
        if row[field] == '':
            return None
        try:
            return desired_type(row[field])
        except ValueError:
            return None
    return None


class Command(BaseCommand):
    help = 'Loads assets from a CSV file, which may be specified by a command-line argument.'

    def add_arguments(self, parser): # Necessary boilerplate for accessing args.
        parser.add_argument('args', nargs='*')

    def handle(self, *args, **options):

        override_clearing = True # Sometimes we may not want to clear assets when loading assets.
        # In fact, eventually loading based on primary_key_from_rocket/synthesized_key will be the default.
        # Then clearing will be the exception.

        if len(args) == 0:
            print("Unable to load assets without knowing the source file. Try:")
            print("   > python manage.py clear_and_add_by_asset [filename] [list of asset types]")
            print("Here the list of asset types is optional. Without that list, this command")
            print("will default to iterating over all types in the source file, sequentially")
            print("clearing and uploading them.")
            return
        else:
            file_name = os.path.join(settings.BASE_DIR, args[0])

            with open(file_name) as f:
                dr = csv.DictReader(f)
                source_asset_types = list(set([row['asset_type'] for row in dr]))


            if len(args) > 1:
                chosen_asset_types = args[1:]
            else:
                chosen_asset_types = source_asset_types
                if not override_clearing:
                    raise ValueError(f"Are you really sure you want to clear all these asset types ({chosen_asset_types})? If so, comment out this exception (or just list them when invoking the command).")
            print(f"chosen_asset_types = {chosen_asset_types}")

            for t in source_asset_types:
                if re.search('\|', t) is not None and t in chosen_asset_types:
                    print(f"Whoa! Whoa! What are we going to do with an asset of type {t}?")
                    raise ValueError("Whoa! Whoa! What are we going to do with an asset of type {t}?")

            # Get existing types
            extant_types = [a.name for a in AssetType.objects.all()]

            new_types = []
            for t in chosen_asset_types:
                if t not in extant_types:
                    new_types.append(t)
            print(f"New types in the source file that are not currently in the database: {new_types}")

            print(f"About to start{'' if override_clearing else 'cleaning and'} uploading {chosen_asset_types}.")

            with open(file_name) as f:
                dr = csv.DictReader(f)
                total_count = 0

                for asset_type in chosen_asset_types:
                    type_count = 0
                    ## Clear the assets of this type if any are found in the database. ##
                    if not override_clearing:
                        if asset_type in extant_types:
                            selected_assets = Asset.objects.filter(asset_types__name=asset_type)
                            if len(selected_assets) > 0:
                                print(f"Clearing all {len(selected_assets)} assets with type '{asset_type}'.")
                                selected_assets.delete()
                            else:
                                print(f"No assets with type '{asset_type}' found.")

                    ## Upload the new assets. ##
                    for row in dr:
                        # get or create a new org
                        if row['asset_type'] == asset_type:
                            organization, organization_created = Organization.objects.get_or_create(
                                name=non_blank_value_or_none(row, 'organization_name'),
                                defaults={
                                    'email': non_blank_value_or_none(row, 'organization_email'),
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
                                    'geocoding_properties': value_or_none(row, 'geocoding_properties'),
                                    'parcel_id': value_or_none(row, 'parcel_id'),
                                    'residence': boolify(value_or_none(row, 'residence')),
                                }
                            )[0]
                          
                            # [ ] Eventually a more sophisticated merging approach will be need to combine
                            # different bits of location data from different assets into one Location object.
                            # At present, this is just filling in gaps but not handling conflicts.
                            if location.latitude is None or location.longitude is None:
                                location.latitude = type_or_none(row, 'latitude', float)
                                location.longitude = type_or_none(row, 'longitude', float)
                                location.geocoding_properties = value_or_none(row, 'geocoding_properties')

                            if location.available_transportation is None:
                                location.available_transportation = value_or_none(row, 'location_transportation')

                            if location.parcel_id is None:
                               location.parcel_id = value_or_none(row, 'parcel_id')

                            if location.residence is None:
                               location.residence = boolify(value_or_none(row, 'residence'))

                            location.save()
                            # END primitive Location object handling

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
                                name=non_blank_value_or_none(row, 'data_source_name'),
                                defaults={'url': row['data_source_url']})[0] if row['data_source_name'] else None

                            asset = Asset.objects.create(
                                name=non_blank_value_or_none(row, 'name'),
                                localizability=get_localizability(non_blank_value_or_none(row, 'localizability')),

                                url=non_blank_value_or_none(row, 'url'),
                                email=non_blank_value_or_none(row, 'email'),
                                phone=standardize_phone(row['phone']),

                                hours_of_operation=non_blank_value_or_none(row, 'hours_of_operation'),
                                holiday_hours_of_operation=non_blank_value_or_none(row, 'holiday_hours_of_operation'),
                                periodicity=non_blank_value_or_none(row, 'periodicity'),
                                capacity=non_blank_type_or_none(row, 'capacity', int),
                                wifi_network=non_blank_value_or_none(row, 'wifi_network'),

                                etl_notes=non_blank_value_or_none(row, 'notes'),

                                child_friendly=boolify(non_blank_value_or_none(row, 'child_friendly')),
                                internet_access=boolify(non_blank_value_or_none(row, 'internet_access')),
                                computers_available=boolify(non_blank_value_or_none(row, 'computers_available')),
                                open_to_public=boolify(non_blank_value_or_none(row, 'open_to_public')),
                                sensitive=boolify(non_blank_value_or_none(row, 'sensitive')),
                                do_not_display=boolify(non_blank_value_or_none(row, 'do_not_display')),

                                location=location,
                                organization=organization,
                                data_source=data_source,
                                primary_key_from_rocket=non_blank_value_or_none(row, 'primary_key_from_rocket'),
                                synthesized_key=non_blank_value_or_none(row, 'synthesized_key'),
                            )

                            asset.asset_types.set(asset_types)
                            asset.tags.set(tags)
                            asset.services.set(services)
                            asset.accessibility_features.set(accessibility_features)
                            asset.hard_to_count_population.set(hard_to_count_pops)
                            asset.save()
                            type_count += 1
                            total_count += 1
                            print('Created', asset)
                    print(f"Created {type_count} assets of type {asset_type}.")
                print(f"Created a total of {total_count} assets.")

