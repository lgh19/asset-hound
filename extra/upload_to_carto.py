import sys, os, csv, time
from carto.auth import APIKeyAuthClient
from carto.sql import SQLClient
from parameters.credentials import CARTO_API_KEY
from pprint import pprint

USERNAME = "wprdc"
USR_BASE_URL = "https://{user}.carto.com/".format(user=USERNAME)
auth_client = APIKeyAuthClient(api_key=CARTO_API_KEY, base_url=USR_BASE_URL)
table_name = 'assets_v1'

def basic_query(sql):
    try:
        data = sql.send('select * from mytable')
    except CartoException as e:
        print("some error ocurred", e)

    return data['rows'] # The data dict also has fields called 'time', 'fields', and 'total_rows'.

def delete_assets_by_type(sql, table_name, asset_type):
     results = sql.send(f"DELETE from {table_name} WHERE asset_type='{asset_type}'")
     return results

def delete_from_carto_by_id(asset_id):
    sql = SQLClient(auth_client)
    results = sql.send(f"DELETE from {table_name} WHERE id ='{asset_id}'")
    return results

def boolean_to_string(b):
    if b is True:
        return "TRUE" # Valid Postgres values for a boolean true value : TRUE, 't', 'true', 'y', 'yes', 'on', '1'
    if b is False:
        return "FALSE"
    raise ValueError(f"It's unclear what to do with a boolean value of {b}.")

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
                    values.append("NULL") # What the oligatory default value should be kind of
                    # depends on how the asset_hound front end is coded.
                    # BUT there was an instance where NULL actually resulted in an
                    # asset showing up on the map.
                else:
                    raise ValueError(f"It's unclear what to do with a boolean value of {row[field]}.")
            else: # I theorized that there needed to be values for these fields because I thought null values
                # caused them to not make it from the Carto dataset to the assets.wprdc.org map.
                # This was wrong. There are records already on the map that have values of "null" for
                # the 'sensitive' field and "" for the do_not_display field.
                values.append("FALSE")
        elif field in ['id', 'latitude', 'longitude']:
            values.append(row[field])
        else:
            values.append(f"'{row[field]}'")

    return ', '.join(values)

def insert_new_assets(sql, table_name, records):
    #q = f"INSERT INTO {table_name} (id, name, asset_type, asset_type_title, category, category_title, latitude, longitude) VALUES (202020, 'Zyzzlvaria Zoo', 'zoo', 'animal places', 'cool_stuff', 'Cool Stuff', 40.5195849005734, -80.0445997570883 );"
    #results = sql.send(q)

    # Example of how to insert a single record:
    #q = f"INSERT INTO {table_name} (id, name, asset_type, asset_type_title, category, category_title, latitude, longitude) VALUES (112644, 'Ormsby Pool and Recreation Center', 'rec_centers', 'Rec Centers', 'civic', 'Civic', 40.4290817, -79.97429357);"

    # Batch inserts can be done like this:
    # INSERT INTO election_results (county_id,voters,pro)
    # VALUES  (1, 11,8),
    #        (12,21,10),
    #        (78,31,27);

    fields = ['id', 'name', 'asset_type', 'asset_type_title', 'category', 'category_title', 'sensitive', 'do_not_display', 'latitude', 'longitude']
    value_tuples = [f"({values_string(r, fields)})" for r in records]
    q = f"INSERT INTO {table_name} ({', '.join(fields)}) VALUES {', '.join(value_tuples)};"
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
    results1 = sql.send(q) # This takes 12 seconds to run for 100,000 rows.
    # Exporting the data immediately after this is run oddly leads to the same CSV file as exporting before
    # it is run, but waiting a minute and exporting again gives something with the_geom values in the same
    # rows as the table on the Carto site. Basically, the exported CSV file can lag the view on the Carto
    # web site by a minute or two.
    q = f"SELECT ST_Transform(ST_SetSRID(st_makepoint(longitude, latitude),4326),3857) as the_geom_webmercator FROM {table_name}"
    results2 = sql.send(q) # This one ran much faster.
    # One improvement is that you can replace ST_SetSRID(st_makepoint(lon, lat)) with CDB_LatLng(lat, lon)
    # though I don't know if it leads to any performance improvement.
    print(f"Tried to add values for the the_geom and the_geom_webmercator fields in {table_name}. The requests completed in {results1['time']} s and {results2['time']} s.")

def get_carto_asset_types(sql, table_name):
    q = f"SELECT count(asset_type), asset_type FROM {table_name} GROUP BY asset_type"
    results = sql.send(q)
    return [r['asset_type'] for r in results['rows']]

sql = SQLClient(auth_client)

#table_name = 'assets_copy'
table_name = 'assets'
#results = sql.send(f"DELETE from {table_name} WHERE id=10106") # Ran this to delete the old Ormsby Pool and Recreation Center. # assets.wprdc.org map seemed to update immediately.
#results = insert_new_assets(sql, table_name) # Ran this (and next line) to add the new record for Ormsby Pool and Recreation Center. # assets.wprdc.org map did not immediately update.
#fix_carto_geofields(table_name) # It took a few minutes, but eventually the update came through. Possibly one extra zoom made the difference.
#fix_carto_geofields('assets')

#records = [{'id': '555228526', 'name': "(secret treasure might be here)", 'asset_type': 'buried_treasure', 'asset_type_title': "Buried treasure", 'category': 'civic', 'category_title': "Civic", 'latitude': 40.499835, 'longitude': -79.912850}]
#results = insert_new_assets(sql, table_name, records) # Ran this (and next line) to add the new record for Ormsby Pool and Recreation Center. # assets.wprdc.org map did not immediately update.
#fix_carto_geofields(table_name) # It took a few minutes, but eventually the update came through. Possibly one extra zoom made the difference.
#assert "This is just" == "a test"


#q = f"SELECT cartodb_id, ST_AsText(the_geom_webmercator) AS the_geom_webmercator FROM {table_name} WHERE id='112644'" # This test suggests that the Carto field values updated.
#results = sql.send(q)
#print(results)

if len(sys.argv) < 2:
    print("Please specify the filename from which to load assets.")
else:
    if sys.argv[1] == 'just_fix':
        fix_carto_geofields(sql, table_name)
        raise ValueError("Halting after attempting to fix geofields.")

    local_filepath = sys.argv[1]
    asset_types = None
    if len(sys.argv) > 2:
        asset_types = sys.argv[2:]
        # Validate these.
        carto_asset_types = get_carto_asset_types(sql, table_name)
        for asset_type in asset_types:
            if asset_type in carto_asset_types:
                print(f"Clearing assets of type {asset_type} from Carto table.")
                delete_assets_by_type(sql, table_name, asset_type)
            else:
                print(f" ** Unable to find any instances of type {asset_type} in the Carto table. ** ")
    else:
        raise ValueError("Not yet coded to handle all asset types at once.")

    reader = csv.DictReader(open(local_filepath))
    records_per_request = 100
    batch_list = []
    pushed = 0
    for k, row in enumerate(reader):
        if asset_types is None or row['asset_type'] in asset_types:
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
