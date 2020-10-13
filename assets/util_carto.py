import copy, re
from carto.auth import APIKeyAuthClient
from carto.sql import SQLClient
from parameters.credentials import CARTO_API_KEY

USERNAME = "wprdc"
USR_BASE_URL = "https://{user}.carto.com/".format(user=USERNAME)

TABLE_NAME = 'assets_v1'

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
def get_carto_asset_ids():
    auth_client = APIKeyAuthClient(api_key=CARTO_API_KEY, base_url=USR_BASE_URL)
    sql = SQLClient(auth_client)
    results = sql.send(f"SELECT id from {TABLE_NAME}")
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


### END Functions for modifying individual records on Carto