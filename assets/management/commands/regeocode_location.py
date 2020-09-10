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
from assets.management.commands.regenerate_locations import form_full_address
from assets.utils import geocode_address # This uses Geocod.io
# _csv.Error: field larger than field limit (131072)

def regeocode(location_id, dry_run):
    location = Location.objects.get(pk=location_id)
    total = len(location.asset_set.all())
    print(f"The location has name '{location.name}', street_address '{location.street_address}', and {total} linked Assets.")

    if location.street_address not in [None, '']:
        
        full_address = form_full_address(row)
        # Try to geocode with Geocod.io/Geomancer
        latitude, longitude, properties = geocode_address(full_address)
        if latitude is None:
            #print(f"Geocoordinates for Location ID {location.id} are being set to (None, None).")
            print(f"Skipping this one since the return geocoordinates are (None, None).")
        else:
            location.latitude = latitude
            location.longitude = longitude
            if latitude is None:
                location.geocoding_properties = 'Unsuccessfully geocoded by Geocodio'
            else:
                location.geocoding_properties = properties
            location._change_reason = 'Regeocoding location'
            if not dry_run:
                location.save()

class Command(BaseCommand):
    help = """For a given location_id, regeocode it based on its address information."""

    def add_arguments(self, parser): # Necessary boilerplate for accessing args.
        parser.add_argument('args', nargs='*')

    def handle(self, *args, **options):
        dry_run = False
        if len(args) != 1:
            raise ValueError("This script accepts exactly one command-line argument, which should be a valid Location ID.")
        regeocode(args[0], dry_run)
