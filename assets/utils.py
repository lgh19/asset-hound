import requests, math

from asset_hound.settings import GEOCODER_API_KEY

from assets.models import Asset

def asset_to_dict_for_csv(asset: Asset):
    return {
        'id': asset.id,
        'name': asset.name,
        'asset_type': '|'.join([t.name for t in asset.asset_types.all()]),
        'raw_asset_ids': '|'.join([str(r.id) for r in asset.rawasset_set.all()]), # This is one field that differs from the RawAsset dump.
        'tags': '|'.join([t.name for t in asset.tags.all()]),
        'location_id': asset.location.id,
        'street_address': asset.location.street_address,
        'unit': asset.location.unit,
        'unit_type': asset.location.unit_type,
        'municipality': asset.location.municipality,
        'city': asset.location.city,
        'state': asset.location.state,
        'zip_code': asset.location.zip_code,
        'latitude': asset.location.latitude,
        'longitude': asset.location.longitude,
        'parcel_id': asset.location.parcel_id,
        'residence': asset.location.residence,
        'iffy_geocoding': asset.location.iffy_geocoding,
        'available_transportation': asset.location.available_transportation,
        'parent_location': asset.location.parent_location,
        'url': asset.url,
        'email': asset.email,
        'phone': asset.phone,
        'hours_of_operation': asset.hours_of_operation,
        'holiday_hours_of_operation': asset.holiday_hours_of_operation,
        'periodicity': asset.periodicity,
        'capacity': asset.capacity,
        'wifi_network': asset.wifi_network,
        'internet_access': asset.internet_access,
        'computers_available': asset.computers_available,
        'accessibility': asset.accessibility,
        'open_to_public': asset.open_to_public,
        'child_friendly': asset.child_friendly,
        'localizability': asset.localizability,
        'sensitive': asset.sensitive,
        'do_not_display': asset.do_not_display,
        'services': '|'.join([s.name for s in asset.services.all()]),
        'hard_to_count_population': '|'.join([p.name for p in asset.hard_to_count_population.all()]),
        'data_source_name': asset.data_source.name,
        'data_source_url': asset.data_source.url,
        'organization_name': asset.organization.name if asset.organization is not None else '',
        'organization_phone': asset.organization.phone if asset.organization is not None else '',
        'organization_email': asset.organization.email if asset.organization is not None else '',
        'etl_notes': asset.etl_notes,
        'geocoding_properties': asset.location.geocoding_properties,
    }

def distance_on_unit_sphere(lat1, long1, lat2, long2):
    # Convert latitude and longitude to
    # spherical coordinates in radians.
    degrees_to_radians = math.pi/180.0

    # phi = 90 - latitude
    phi1 = (90.0 - lat1)*degrees_to_radians
    phi2 = (90.0 - lat2)*degrees_to_radians

    # theta = longitude
    theta1 = long1*degrees_to_radians
    theta2 = long2*degrees_to_radians

    # Compute spherical distance from spherical coordinates.

    # For two locations in spherical coordinates
    # (1, theta, phi) and (1, theta', phi')
    # cosine( arc length ) =
    # sin phi sin phi' cos(theta-theta') + cos phi cos phi'
    # distance = rho * arc length

    cos = (math.sin(phi1)*math.sin(phi2)*math.cos(theta1 - theta2) +
    math.cos(phi1)*math.cos(phi2))

    try:
        arc = math.acos( cos )
    except ValueError:
        if 1.0 < cos < 1.01:
            cos = 1
        try:
            arc = math.acos( cos )
        except ValueError:
            ic(cos)
            raise
    # Remember to multiply arc by the radius of the earth
    # in your favorite set of units to get length.
    return arc

def distance(lat1, long1, lat2, long2):
    if lat1 in ['', None] or long1 in ['', None] or lat2 in ['', None] or long2 in ['', None]:
        return None # Don't try to calculate distances of invalid coordinates.
    arc = distance_on_unit_sphere(lat1, long1, lat2, long2)
    R = 20.902*1000*1000 # in feet
    # Remember to multiply arc by the radius of the earth
    # in your favorite set of units to get length.
    return R*arc

def geocode_address(address):
    """ Takes a string address and attempts to geocode it using a remote geocoder

    Returns ({float}, {float}) (lat,lng) tuple
    """
    url = 'https://api.geocod.io/v1.4/geocode'
    try:
        r = requests.get(url, params={'q': address, 'api_key': GEOCODER_API_KEY})
        response_data = r.json()
        lat = response_data['results'][0]['location']['lat']
        lng = response_data['results'][0]['location']['lng']
        return lat, lng
    except Exception as e:
        # todo: handle different exceptions differently
        print(e)
        return None, None

