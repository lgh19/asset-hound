import sys
import os
import csv
import time
import math
from carto.auth import APIKeyAuthClient
from carto.sql import SQLClient
from operator import itemgetter

from django.conf import settings
from django.core.management.base import BaseCommand

from assets.models import Asset, AssetType
from parameters.credentials import CARTO_API_KEY
from assets.util_carto import delete_from_carto_by_id, update_asset_on_carto, insert_new_assets_into_carto, get_carto_asset_ids, TABLE_NAME

USERNAME = "wprdc" # Replicated in 
USR_BASE_URL = "https://{user}.carto.com/".format(user=USERNAME)  # util_carto.py

DEFAULT_CARTO_FIELDS = ['id', 'name', 'asset_type', 'asset_type_title',
                        'category', 'category_title', 'sensitive',
                        'do_not_display', 'latitude', 'longitude', 'location_id']
# Other Carto fields that it doesn't seem important to update: primary_key_from_rocket


def format_value_by_field(value, field):
    """ [Convert to string,] and format values to work with Carto API"""
    if field in ['sensitive', 'do_not_display']:
        if type(value) == bool:
            return str(value).upper()
        elif value in ['True', 'False']:
            return value.upper()
        elif value in ['', None]:
            value.append("NULL")

def make_values_tuple_string_from_model(asset, fields):
    """ Transform Asset into a SQL valid `VALUES` tuple string"""
    return [format_value_by_field(getattr(asset, field, None), field) for field in fields]


def validate_asset(asset):
    """ Checks that an Asset has geocoordinates and (therefore) belongs on Carto."""
    if getattr(getattr(asset, 'location', None), 'latitude', None) not in [None, 0] and getattr(getattr(asset, 'location', None), 'latitude', None) not in [None, 0]:
        return True
    return False

def delete_assets_by_type(sql, table_name, asset_type):
    results = sql.send(f"DELETE from {table_name} WHERE asset_type='{asset_type}'")
    return results


def values_string(row, fields):
    values = []

    for field in fields:
        if field in ['sensitive', 'do_not_display']:
            if field in row:
                if type(row[field]) == bool:
                    values.append(boolean_to_string(row[field]))
                elif row[field] in ['True', 'False']:
                    values.append(row[field].upper())
                elif row[field] in ['', None]:
                    values.append("NULL")
                else:
                    raise ValueError(f"It's unclear what to do with a boolean value of {row[field]}.")
            else:  # I theorized that there needed to be values for these fields because I thought null values
                # caused them to not make it from the Carto dataset to the assets.wprdc.org map.
                # This was wrong. There are records already on the map that have values of "null" for
                # the 'sensitive' field and "" for the do_not_display field.
                values.append("FALSE")
        elif field in ['id', 'latitude', 'longitude']:
            values.append(row[field])
        else:
            values.append(f"'{row[field]}'")

    return f"({', '.join(values)})"


def format_value(value, field):
    """[Convert to string,] and format values to work with Carto API."""
    # This seems incomplete
    if field in ['sensitive', 'do_not_display']:
        if type(value) == bool:
            return str(value).upper()
        elif value in ['True', 'False']:
            return value.upper()
        elif value in ['', None]:
            value.append("NULL")


def make_values_tuple_string(record, fields):
    """Transform record dict into a SQL-valid `VALUES` tuple string."""
    return [format_value(record[field], field) for field in fields]

def insert_new_assets(sql, table_name, records, fields):
    # q = f"INSERT INTO {table_name} (id, name, asset_type, asset_type_title, category, category_title, latitude, longitude) VALUES (202020, 'Zyzzlvaria Zoo', 'zoo', 'animal places', 'cool_stuff', 'Cool Stuff', 40.5195849005734, -80.0445997570883 );"
    # results = sql.send(q)

    # Example of how to insert a single record:
    # q = f"INSERT INTO {table_name} (id, name, asset_type, asset_type_title, category, category_title, latitude, longitude) VALUES (112644, 'Ormsby Pool and Recreation Center', 'rec_centers', 'Rec Centers', 'civic', 'Civic', 40.4290817, -79.97429357);"

    # Batch inserts can be done like this:
    # INSERT INTO election_results (county_id,voters,pro)
    # VALUES  (1, 11,8),
    #        (12,21,10),
    #        (78,31,27);

    # map set of records into value tuple strings
    #values_tuple_strings = [make_values_tuple_string(r, fields) for r in records]

    values_tuple_strings = [values_string(r, fields) for r in records]

    q = f"INSERT INTO {table_name} ({', '.join(fields + ['the_geom', 'the_geom_webmercator'])}) " \
        f"VALUES {', '.join(map(lambda x: x + 1, values_tuple_strings))};"

    assert len(q) < 16384
    results = sql.send(q)


def check_geom_webmercator(table_name):
    # Query to check on the normally hidden the_geom_webmercator value:
    asset_type = 'zoo'
    q = f"SELECT cartodb_id, ST_AsText(the_geom_webmercator) AS the_geom_webmercator FROM {table_name} WHERE asset_type='{asset_type}'"
    results = sql.send(q)
    print(results)


def fix_carto_geofields(sql, table_name):
    # Now the problem with pushing this data through SQL calls is that Carto does not rerun the
    # processes that add values for the_geom and the_geom_webmercator. So it kind of seems like
    # we have to do this ourselves as documented at
    # https://gis.stackexchange.com/a/201908

    q = f"UPDATE {table_name} SET the_geom = ST_SetSRID(st_makepoint(longitude, latitude),4326)"
    # This works because 'longitude' and 'latitude' are the names of the corresponding fields in the CSV file.
    results1 = sql.send(q)  # This takes 12 seconds to run for 100,000 rows.
    # Exporting the data immediately after this is run oddly leads to the same CSV file as exporting before
    # it is run, but waiting a minute and exporting again gives something with the_geom values in the same
    # rows as the table on the Carto site. Basically, the exported CSV file can lag the view on the Carto
    # web site by a minute or two.
    q = f"SELECT ST_Transform(ST_SetSRID(st_makepoint(longitude, latitude),4326),3857) as the_geom_webmercator FROM {table_name}"
    results2 = sql.send(q)  # This one ran much faster.
    # One improvement is that you can replace ST_SetSRID(st_makepoint(lon, lat)) with CDB_LatLng(lat, lon)
    # though I don't know if it leads to any performance improvement.
    print(f"Tried to add values for the the_geom and the_geom_webmercator fields in {table_name}. The requests completed in {results1['time']} s and {results2['time']} s.")


def get_carto_asset_types(sql, table_name):
    q = f"SELECT count(asset_type), asset_type FROM {table_name} GROUP BY asset_type"
    results = sql.send(q)
    return [r['asset_type'] for r in results['rows']]


def validate_row(row, asset_types):
    """ Checks that a row has the proper asset type, can be geocoded, and belongs on carto."""
    if asset_types is None or row['asset_type'] in asset_types:
        if row['latitude'] or row['longitude']:  # excludes null island but that's probs fine for now
            return True
    return False


def replace_by_type(local_filepath, asset_types=('homeless_shelters',), table_name='assets', just_fix=False):
    auth_client = APIKeyAuthClient(api_key=CARTO_API_KEY, base_url=USR_BASE_URL)
    sql = SQLClient(auth_client)

    if not local_filepath:
        print("Please specify the filename from which to load assets.")
    else:
        if just_fix:
            fix_carto_geofields(sql, table_name)
            print("Halting after attempting to fix geofields.")
            exit(0)

        carto_asset_types = get_carto_asset_types(sql, table_name)
        for asset_type in asset_types:
            if asset_type in carto_asset_types:
                print(f"Clearing assets of type {asset_type} from Carto table.")
                delete_assets_by_type(sql, table_name, asset_type)
            else:
                print(f" ** Unable to find any instances of type {asset_type} in the Carto table. ** ")

        reader = csv.DictReader(open(local_filepath))
        records_per_request = 100
        batch_list = []
        pushed = 0

        for row in reader:
            if not validate_row(row, asset_types):
                continue

            batch_list.append(row)
            if len(batch_list) == records_per_request:
                # push records
                print(f"Pushing {len(batch_list)} assets.")
                pushed += len(batch_list)
                insert_new_assets(sql, table_name, batch_list)
                time.sleep(0.01)
                batch_list = []

        if len(batch_list) > 0:
            print(f"Pushing {len(batch_list)} assets.")
            insert_new_assets(sql, table_name, batch_list)
            pushed += len(batch_list)

        if pushed > 0:
            fix_carto_geofields(sql, table_name)

# Actually upsert_by_id and update_asset may not really be needed as they're
# already in extra/push_record_to_carto.py.
def upsert_by_id(local_filepath, table_name='assets', just_fix=False):
    auth_client = APIKeyAuthClient(api_key=CARTO_API_KEY, base_url=USR_BASE_URL)
    sql = SQLClient(auth_client)

    if not local_filepath:
        print("Please specify the filename from which to load assets.")
    else:
        if just_fix:
            fix_carto_geofields(sql, table_name)
            print("Halting after attempting to fix geofields.")
            exit(0)

        existing_ids = get_carto_asset_ids()

        reader = csv.DictReader(open(local_filepath))
        records_per_request = 100
        insert_list = []
        pushed = 0

        for row in reader:
            if not validate_row(row, asset_types):
                continue

            if row['id'] in existing_ids:
                update_asset(row, sql, table_name)
            else:
                insert_list.append(row)

            if len(insert_list) == records_per_request:
                # push records
                print(f"Pushing {len(insert_list)} assets.")
                pushed += len(insert_list)
                insert_new_assets(sql, table_name, insert_list)
                time.sleep(0.01)
                insert_list = []

        if len(insert_list) > 0:
            print(f"Pushing {len(insert_list)} assets.")
            insert_new_assets(sql, table_name, insert_list)
            pushed += len(insert_list)

        if pushed > 0:
            fix_carto_geofields(sql, table_name)

class Command(BaseCommand):
    help = 'Sync some assets to the Carto table.'

    def add_arguments(self, parser): # Necessary boilerplate for accessing args.
        parser.add_argument('args', nargs='*')

    def handle(self, *args, **options):
        extant_asset_types = [a.name for a in AssetType.objects.all()]
        chosen_asset_types = []
        for arg in args:
            if arg in extant_asset_types:
                chosen_asset_types.append(arg)
            else:
                raise ValueError(f"It is not clear what to with this argument: '{arg}'.")


        if chosen_asset_types == []:
            print(f"Preparing to sync all Assets to Carto.")
            chosen_assets = Asset.objects.all()
            raise ValueError("Not ready to sync all Assets to Carto yet.")
        else:
            print(f"Preparing to sync all Assets in these types: {chosen_asset_types}")
            chosen_assets = Asset.objects.filter(asset_types__name__in = chosen_asset_types)

        records_per_request = 100
        insert_list = []
        pushed = 0
        existing_ids = get_carto_asset_ids()
        radius_offset = 0.0001 # This will be about 36 feet north/south and 29 feet east/west.
        for a in chosen_assets:
            if a.do_not_display == False:
                print(f"Deleting the record with ID {a.id} from Carto.")
                delete_from_carto_by_id(a.id)
                continue

            if not validate_asset(a):
                continue

            # Compute and apply geocoordinate offsets to distinguish overlapping assets
            overlapping_assets = a.location.asset_set.all()
            asset_types_and_names = [{'name': a.name, 'type': a.asset_types.all()[0].name, 'asset_id': a.id} for a in overlapping_assets]
                # This assumes that there is only one asset type per asset, which is not enforced by the model,
                # but which we have decided should be the case generally becausing mixing asset types may make
                # things like operating hours poorly defined.
            sorted_asset_types_and_names = sorted(asset_types_and_names, key=itemgetter('type', 'name'))
            number_of_overlapping_assets = len(overlapping_assets)
            n = [a['asset_id'] for a in sorted_asset_types_and_names].index(a.id)
            if number_of_overlapping_assets > 1:
                print(f" ** Offsetting the marker for the asset named '{a.name}' with address {a.location.street_address}. **")
                new_latitude  = a.location.latitude  + radius_offset*math.cos(n*2*math.pi/number_of_overlapping_assets)
                new_longitude = a.location.longitude + radius_offset*math.sin(n*2*math.pi/number_of_overlapping_assets)
            else:
                new_latitude = a.location.latitude
                new_longitude = a.location.longitude

            if a.id in existing_ids:
                update_asset_on_carto({'asset': a, 'latitude': new_latitude, 'longitude': new_longitude}, DEFAULT_CARTO_FIELDS)
                pushed += 1
            else:
                insert_list.append({'asset': a, 'latitude': new_latitude, 'longitude': new_longitude})

            if len(insert_list) == records_per_request:
                # push records
                print(f"Pushing {len(insert_list)} assets.")
                pushed += len(insert_list)
                insert_new_assets_into_carto(insert_list, DEFAULT_CARTO_FIELDS)
                time.sleep(0.01)
                insert_list = []

        if len(insert_list) > 0:
            print(f"Pushing {len(insert_list)} assets.")
            insert_new_assets_into_carto(insert_list, DEFAULT_CARTO_FIELDS)
            pushed += len(insert_list)

        # Fix all those Carto geofields
        if pushed > 0:
            auth_client = APIKeyAuthClient(api_key=CARTO_API_KEY, base_url=USR_BASE_URL)
            sql = SQLClient(auth_client)
            fix_carto_geofields(sql, TABLE_NAME)


#if __name__ == '__main__':
#    replace_by_type('asset_dump_homeless_shelters.csv')
