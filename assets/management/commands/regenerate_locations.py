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
                           ProvidedService,
                           TargetPopulation,
                           DataSource)

csv.field_size_limit(sys.maxsize)  # looks like this:

from assets.management.commands.util import parse_cell
from assets.management.commands.clear_and_load_by_type import get_location_by_keys, update_or_create_location
from assets.utils import geocode_address # This uses Geocod.io

# _csv.Error: field larger than field limit (131072)

def form_full_address(row):
    maybe_malformed = False
    if 'city' in row:
        city = row['city']
    elif 'municipality' in row:
        city = row['municipality']

    if 'state' in row:
        state = row['state']
    else:
        state = 'PA'

    return "{}, {}, {} {}".format(row['street_address'], city, state, row['zip_code'])

class Command(BaseCommand):
    help = """For a given location_id, find all the linked Assets, pull their RawAssets and attempt to 
    generate new Location instances from the location fields in the RawAsset."""

    def add_arguments(self, parser): # Necessary boilerplate for accessing args.
        parser.add_argument('args', nargs='*')

    def handle(self, *args, **options):
        dry_run = True ############ [ ] Remove
        if len(args) != 1:
            raise ValueError("This script accepts exactly one command-line argument, which should be a valid Location ID.")
        overloaded_location = Location.objects.get(pk=args[0])

        locations_handled = 0
        for asset in overloaded_location.asset_set.all():
            raw_assets = list(asset.rawasset_set.all())
            if len(raw_assets) == 0:
                raise ValueError(f"The asset with ID {asset.id} has no linked raw assets!")
            if len(raw_assets) > 1:
                raise ValueError(f"The asset with ID {asset.id} has multiple linked raw assets!")
                # Next step here is to pull all the location data and see if it's consistent 
                # enough to be auto-joined into a single location.
            raw_asset = raw_assets[0]
            row = {'parcel_id': raw_asset.parcel_id,
                    'street_address': raw_asset.street_address,
                    #'unit' = raw_asset.unit, # not yet supported
                    #'unit_type' = raw_asset.unit_type, # not yet supported
                    #'municipality' = raw_asset.municipality, # not yet supported
                    'city': raw_asset.city,
                    'state': raw_asset.state,
                    'zip_code': raw_asset.zip_code,
                    'available_transportation': raw_asset.available_transportation,
                    'latitude': raw_asset.latitude,
                    'longitude': raw_asset.longitude,
                    'residence': raw_asset.residence,
                    'geocoding_properties': raw_asset.geocoding_properties,
                    'parcel_id': raw_asset.parcel_id,
                    }
            # Try to find a matching extant location
            keys = ['street_address__iexact', 'city__iexact', 'state__iexact', 'zip_code__startswith']
            location, location_obtained = get_location_by_keys(row, keys)
            if not location_obtained: # If none comes up, create a new one.
                kwargs = row
                if 'street_address' in row and row['street_address'] not in [None, '']:
                    full_address = form_full_address(row)
                    latitude, longitude = geocode_address(full_address)
                    # Try to geocode with Geocod.io
                    kwargs['latitude'] = latitude
                    kwargs['longitude'] = longitude
                    kwargs['geocoding_properties'] = 'Geocoded by Geocodio'
                    location = Location(**kwargs)
                    location._change_reason = 'Regenerating locations (bad initial Location assignment)'
                    if not dry_run: ################# [ ] Remove
                        location.save()
                    location_obtained = True
                    location_created = True

            if not dry_run and location_obtained: ############## [ ] Remove
                asset.location = location
                asset._change_reason = 'Regenerating locations (bad initial Location assignment)'
                asset.save()
                locations_handled += 1

        print(f"Handled {locations_handled} asset locations. (Some may have been pre-existing.)")
