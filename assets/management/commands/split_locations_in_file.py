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

from assets.management.commands.regenerate_locations import split_location

class Command(BaseCommand):
    help = """For each location ID in a file of location ID values, find all the linked Assets, pull their RawAssets and attempt to
    generate new Location instances from the location fields in the RawAsset."""

    def add_arguments(self, parser): # Necessary boilerplate for accessing args.
        parser.add_argument('args', nargs='*')

    def handle(self, *args, **options):
        if len(args) != 1 or not os.path.isfile(args[0]):
            raise ValueError("This script accepts exactly one command-line argument, which should be a valid filepath.")
        with open(args[0], 'r') as f:
            dr = csv.DictReader(f)
            cumulative_assets_handled = 0
            for row in dr:
                if 'location_id' in row:
                    cumulative_assets_handled += split_location(row['location_id'])
            print(f"\nAfter all of that, a total of {cumulative_assets_handled} assets were handled.")
