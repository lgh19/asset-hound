import csv
import os
import re
import sys  # This is a workaround for an error that
csv.field_size_limit(sys.maxsize)  # looks like this:
# _csv.Error: field larger than field limit (131072)

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


class Command(BaseCommand):
    help = 'Clear one or more particular types of asset (specified by command-line arguments).'

    def add_arguments(self, parser): # Necessary boilerplate for accessing args.
        parser.add_argument('args', nargs='*')

    def handle(self, *args, **options):
        # Get existing types
        all_types = [a.name for a in AssetType.objects.all()]

        print(f"Existing asset types are {all_types}")

        # Get a type to clear from args
        all_assets = Asset.objects.all()
        print(f"type = {all_assets[1000].asset_types.all()}")
        for arg in args:
            if arg not in all_types:
                print(f"Unable to find asset type '{arg}' in the database.")
            else:
                selected_assets = Asset.objects.filter(asset_types__name=arg)
                print(f"{selected_assets}")
                if len(selected_assets) > 0:
                    print(f"Clearing all assets with type '{arg}'.")
                    selected_assets.delete()
                else:
                    print(f"No assets with type '{arg}' found.")

