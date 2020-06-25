import csv
import os

from django.conf import settings
from django.core.management.base import BaseCommand

from assets.models import Asset


class Command(BaseCommand):
    help = 'Delete assets between the specified id values.\n\nUsage:\n> python manage.py delete_assets_by_id <id_lower> <id_upper>'

    def add_arguments(self, parser): # Necessary boilerplate for accessing args.
        parser.add_argument('args', nargs='*')

    def handle(self, *args, **options):

        if len(args) == 2:
            assets_iterator = Asset.objects.filter(id__gte=args[0], id__lte=args[1])
            print(f"This will delete all assets between id = {args[0]} and {args[1]}")
            assets_iterator.delete()
        elif len(args) == 1:
            print(f"This does nothing because one 'id' value does not define a range.")
        else:
            print(f"This does nothing because no 'id' values were specified.")
