import requests, math, time

from asset_hound.settings import GEOCODER_API_KEY

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

def geocode_address_with_geomancer(address):
    url = "https://tools.wprdc.org/geo/geocode?addr={}".format(address)
    r = requests.get(url)
    result = r.json()
    time.sleep(0.1)
    if result['data']['status'] == "OK":
        longitude, latitude = result['data']['geom']['coordinates']
        return longitude, latitude
    print("Unable to geocode {}, failing with status code {}.".format(address, result['data']['status']))
    return None, None

def geocode_address(address):
    """ Takes a string address and attempts to geocode it using a remote geocoder

    Returns ({float}, {float}) (lat,lng) tuple
    """
    url = 'https://api.geocod.io/v1.4/geocode'
    try:
        r = requests.get(url, params={'q': address, 'api_key': GEOCODER_API_KEY})
        response_data = r.json()
        if 'error' in response_data:
            print(f"Geocodio response: {response_data['error']}")
            longitude, latitude = geocode_address_with_geomancer(address)
            if longitude is not None:
                return latitude, longitude, "Geocoded with Geomancer"
            return None, None, None
        lat = response_data['results'][0]['location']['lat']
        lng = response_data['results'][0]['location']['lng']
        first_result = response_data['results'][0]
        wanted_keys = ['accuracy', 'accuracy_type', 'address_components']
        properties = dict((k, first_result[k]) for k in wanted_keys if k in first_result)
        properties['geocoder'] = 'Geocodio'
        return lat, lng, properties
    except Exception as e:
        # todo: handle different exceptions differently
        print(e)
        return None, None, None

