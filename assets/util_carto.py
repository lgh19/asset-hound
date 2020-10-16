import copy, re, math, time
from operator import itemgetter
from carto.auth import APIKeyAuthClient
from carto.sql import SQLClient
from parameters.credentials import CARTO_API_KEY

USERNAME = "wprdc"
USR_BASE_URL = "https://{user}.carto.com/".format(user=USERNAME)
DEFAULT_CARTO_FIELDS = ['id', 'name', 'asset_type', 'asset_type_title',
                        'category', 'category_title', 'sensitive',
                        'do_not_display', 'latitude', 'longitude', 'location_id']
# Other Carto fields that it doesn't seem important to update: primary_key_from_rocket

TABLE_NAME = 'assets_v1'

def validate_asset(asset):
    """ Checks that an Asset has geocoordinates and (therefore) belongs on Carto."""
    if getattr(getattr(asset, 'location', None), 'latitude', None) not in [None, 0] and getattr(getattr(asset, 'location', None), 'latitude', None) not in [None, 0]:
        return True
    return False

def boolean_to_string(b):
    if b is True:
        return "TRUE" # Valid Postgres values for a boolean true value : TRUE, 't', 'true', 'y', 'yes', 'on', '1'
    if b is False:
        return "FALSE"
    raise ValueError(f"It's unclear what to do with a boolean value of {b}.")

def sql_escape(s):
    s = re.sub("'", '"', s)
    return s

def extract_values_from_model(asset, fields):
    values = []

    for field in fields:
        if field == 'asset_type':
            value = asset.asset_types.all()[0].name # Here, we are explicitly ignoring
            # asset types beyond the first (because the new policy is one
            # asset type per Asset), though this could be rectified by
            # returning a list of values strings and modifying the code on the
            # other end.
        elif field == 'asset_type_title':
            value = asset.asset_types.all()[0].title
        elif field == 'category':
            value = asset.asset_types.all()[0].category.name
        elif field == 'category_title':
            value = asset.asset_types.all()[0].category.title
        elif field in ['latitude', 'longitude']:
            value = getattr(getattr(asset, 'location', None), field, None)
        elif field == 'location_id':
            value = getattr(getattr(asset, 'location', None), 'id', None)
        else:
            value = getattr(asset, field, None)

        if field in ['sensitive', 'do_not_display', 'the_geom', 'the_geom_webmercator']:
            if type(value) == bool:
                values.append(boolean_to_string(value))
            elif value in ['True', 'False']:
                values.append(value.upper())
            elif value in ['', None]:
                values.append("NULL")
            else:
                raise ValueError(f"It's unclear what to do with a boolean value of {value}.")
            # I theorized that there needed to be values for these fields because I thought null values
            # caused them to not make it from the Carto dataset to the assets.wprdc.org map.
            # This was wrong. There are records already on the map that have values of "null" for
            # the 'sensitive' field and "" for the do_not_display field.
        elif field in ['id', 'latitude', 'longitude']:
            values.append(str(value)) # Coerce to string for the join function below.
        else:
            value = sql_escape(str(value))
            values.append(f"'{value}'")
    return values

def batch_values_string_from_model(asset_dict, fields):
    asset = asset_dict['asset']
    values = extract_values_from_model(asset, fields)
    # Handle geocoordinates overrides
    for f, v in zip(fields, values):
        if f == 'latitude':
            v = asset_dict['latitude']
        elif f == 'longitude':
            v = asset_dict['longitude']
    return f"({', '.join(values)})"

def set_string_from_model(asset_dict, fields):
    asset = asset_dict['asset']
    values = extract_values_from_model(asset, fields)
    # Handle geocoordinates overrides
    fields_values = {f: v for f, v in zip(fields, values)}
    fields_values['latitude'] = asset_dict['latitude']
    fields_values['longitude'] = asset_dict['longitude']
    definitions = [f"{f} = {v}" for f, v in fields_values.items()]
    return f"{', '.join(definitions)}"

### BEGIN Functions for modifying individual records on Carto
def get_carto_asset_ids(id_to_check=None):
    auth_client = APIKeyAuthClient(api_key=CARTO_API_KEY, base_url=USR_BASE_URL)
    sql = SQLClient(auth_client)
    if id_to_check is None:
        results = sql.send(f"SELECT id FROM {TABLE_NAME}")
    else:
        results = sql.send(f"SELECT id FROM {TABLE_NAME} WHERE id = {id_to_check}")
    ids = [r['id'] for r in results['rows']]
    return ids

def delete_from_carto_by_id(asset_id):
    auth_client = APIKeyAuthClient(api_key=CARTO_API_KEY, base_url=USR_BASE_URL)
    sql = SQLClient(auth_client)
    results = sql.send(f"DELETE from {TABLE_NAME} WHERE id ='{asset_id}'")
    return results

def update_asset_on_carto(asset_dict, fields):
    auth_client = APIKeyAuthClient(api_key=CARTO_API_KEY, base_url=USR_BASE_URL)
    sql = SQLClient(auth_client)
    #values_tuple_strings = [make_values_tuple_string_from_model(r, fields) for r in [asset]]
    # OR POSSIBLY
    #values_tuple_strings = [make_values_tuple_string_from_model(asset, fields)]


    #q = f"UPDATE {TABLE_NAME} SET {values_tuple_strings} WHERE asset_id = {asset.id};"

    #values_tuple_strings = [values_string_from_model(asset, fields)]
    #q = f"UPDATE {TABLE_NAME} SET ({', '.join(fields + ['the_geom', 'the_geom_webmercator'])}) " \
    #    f"VALUES {', '.join(map(lambda x: x + 1, values_tuple_strings))};" # This is throwing an
    # error, and it's really not clear why it's trying to map a math function over strings.
    # Let's ignore the the_geom* fields for now and do the update the simple way:

    # Single updates can be done like this:
    # UPDATE election_results SET votes=52, pro=24 WHERE county_id = 1;

    other_fields = copy.deepcopy(fields)
    other_fields.remove('id')
    q = f"UPDATE {TABLE_NAME} SET {set_string_from_model(asset_dict, other_fields)} WHERE id = {asset_dict['asset'].id};"
    assert len(q) < 16384
    print(q)
    results = sql.send(q)

def insert_new_assets_into_carto(asset_dicts, fields):
    auth_client = APIKeyAuthClient(api_key=CARTO_API_KEY, base_url=USR_BASE_URL)
    sql = SQLClient(auth_client)
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

    extra_fields = ['the_geom', 'the_geom_webmercator']
    fields_extended = fields + extra_fields
    for a_dict in asset_dicts:
        for f in extra_fields:
            a_dict[f] = None

    values_tuple_strings = [batch_values_string_from_model(a_dict, fields_extended) for a_dict in asset_dicts]

    q = f"INSERT INTO {TABLE_NAME} ({', '.join(fields_extended)}) " \
        f"VALUES {', '.join(values_tuple_strings)};"

    assert len(q) < 16384
    print(q)
    results = sql.send(q)


def sync_asset_to_carto(a, existing_ids, pushed, insert_list, records_per_request=100):
    radius_offset = 0.00005 # This will be about 18 feet north/south and 15 feet east/west.

    if a.do_not_display == True:
        print(f"Deleting the record with ID {a.id} from Carto.")
        delete_from_carto_by_id(a.id)
        return pushed, insert_list

    if not validate_asset(a):
        return pushed, insert_list

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
        new_latitude  = a.location.latitude  + radius_offset*math.cos(n*2*math.pi/number_of_overlapping_assets)
        new_longitude = a.location.longitude + radius_offset*math.sin(n*2*math.pi/number_of_overlapping_assets)
        print(f"    ** Offsetting the marker for the asset named '{a.name}' with address {a.location.street_address} to ({new_latitude}, {new_longitude}). **   ")
    else:
        new_latitude = a.location.latitude
        new_longitude = a.location.longitude

    if a.id in existing_ids:
        update_asset_on_carto({'asset': a, 'latitude': new_latitude, 'longitude': new_longitude}, DEFAULT_CARTO_FIELDS)
        pushed += 1
    else:
        insert_list.append({'asset': a, 'latitude': new_latitude, 'longitude': new_longitude})

    if len(insert_list) >= records_per_request:
        # Push records
        print(f"Pushing {len(insert_list)} assets.")
        pushed += len(insert_list)
        insert_new_assets_into_carto(insert_list, DEFAULT_CARTO_FIELDS)
        time.sleep(0.01)
        insert_list = []
    return pushed, insert_list

### END Functions for modifying individual records on Carto

def fix_carto_geofields(asset_id=None):
    auth_client = APIKeyAuthClient(api_key=CARTO_API_KEY, base_url=USR_BASE_URL)
    sql = SQLClient(auth_client)
    # Now the problem with pushing this data through SQL calls is that Carto does not rerun the
    # processes that add values for the_geom and the_geom_webmercator. So it kind of seems like
    # we have to do this ourselves as documented at
    # https://gis.stackexchange.com/a/201908

    q = f"UPDATE {TABLE_NAME} SET the_geom = ST_SetSRID(st_makepoint(longitude, latitude),4326)"
    if asset_id is not None:
        q += f" WHERE id = {asset_id}" # This can significantly speed up Carto geofield updates
        # when saving a single model instance.

    # This works because 'longitude' and 'latitude' are the names of the corresponding fields in the CSV file.
    results1 = sql.send(q)  # This takes 12 seconds to run for 100,000 rows.
    # Exporting the data immediately after this is run oddly leads to the same CSV file as exporting before
    # it is run, but waiting a minute and exporting again gives something with the_geom values in the same
    # rows as the table on the Carto site. Basically, the exported CSV file can lag the view on the Carto
    # web site by a minute or two.
    q = f"SELECT ST_Transform(ST_SetSRID(st_makepoint(longitude, latitude),4326),3857) as the_geom_webmercator FROM {TABLE_NAME}"
    results2 = sql.send(q)  # This one ran much faster.
    # One improvement is that you can replace ST_SetSRID(st_makepoint(lon, lat)) with CDB_LatLng(lat, lon)
    # though I don't know if it leads to any performance improvement.
    print(f"Tried to add values for the the_geom and the_geom_webmercator fields in {TABLE_NAME}. The requests completed in {results1['time']} s and {results2['time']} s.")
