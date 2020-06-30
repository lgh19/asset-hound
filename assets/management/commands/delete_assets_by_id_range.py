import csv
import os

from django.conf import settings
from django.core.management.base import BaseCommand

from assets.models import Asset

class Command(BaseCommand):
    help = 'Delete assets between the specified id values.\n\nUsage:\n> python manage.py delete_assets_by_id_range <id_lower> <id_upper>'

    def add_arguments(self, parser): # Necessary boilerplate for accessing args.
        parser.add_argument('args', nargs='*')

    def handle(self, *args, **options):

        if len(args) == 2:
            assert int(args[0]) <= int(args[1]) # Check that the command-line arguments
                                                # represent a valid range.
            if int(args[1]) - int(args[0]) > 50000:
                print(f"Preparing to deleting {int(args[1]) - int(args[0]):,} records!")
            if int(args[0]) > 200776 or int(args[1]) > 200776:
                raise ValueError(f"That range includes currently protected v1 assets.")

            if input(f"About to delete all {int(args[1]) - int(args[0]):,} assets between id = {int(args[0]):,} and {int(args[1]):,}. \nAre you sure? (y/n) ") != "y":
                print("OK, never mind.")
                exit()
            assets_iterator = Asset.objects.filter(id__gte=args[0], id__lte=args[1])
            print(f"Deleting all {int(args[1]) - int(args[0]):,} assets between id = {args[0]} and {args[1]}...")

            assets_iterator.delete()
            print(f"Done.")
        elif len(args) == 1:
            print(f"This does nothing because one 'id' value does not define a range.")
        else:
            print(f"This does nothing because no 'id' values were specified.")
