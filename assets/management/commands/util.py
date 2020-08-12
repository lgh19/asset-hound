import requests, math, re, phonenumbers

def parse_cell(cell):
    return cell.split('|')

def get_localizability(l):
    return l[:3].upper()

def boolify(x):
    if x in [None, '']:
        return None
    return x.lower() == 'true'

def standardize_phone(phone):
    if phone is None:
        return None
    assert type(phone) == str
    result_number = None
    phone = re.sub('\.0$', '', phone) # Deal with Excel converting phone numbers to floats.
    try:
        candidate_phone = '+1' + re.sub(r'\D', '', phone) # This actually adds a leading '+1'
        # even if the phone number already starts with a 1, but the phonenumbers.parse function is
        phone_number = phonenumbers.parse(candidate_phone) # able to correct this.
        if phonenumbers.is_valid_number(phone_number):
            result_number = f'+{phone_number.country_code}{phone_number.national_number}'
    except Exception as e: # This is complaining for unknown reasons about what appear to be valid phone numbers.
        print(e)
    print(result_number)
    return result_number

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
    arc = distance_on_unit_sphere(lat1, long1, lat2, long2)
    R = 20.902*1000*1000 # in feet
    # Remember to multiply arc by the radius of the earth
    # in your favorite set of units to get length.
    return R*arc

def validate_address(street_address, municipality, city, state, zip_code, parcel_id, latitude, longitude):
    address_object = {'street_address': None,
            'unit': None,
            'unit_type': None,
            'municipality': None,
            'city': None,
            'state': None,
            'zip_code': None,
            'parcel_id': None,
            'latitude': None,
            'longitude': None}
    validated = True # Assume the street address is fine until a problem is encountered.
    if parcel_id is not None:
        # Get other elements from Geomancer (write an API endpoint for this).
        pass        
        


        # Compare other elements
        

    # Call Geomancer with address information and get results.

    if latitude is not None and longitude is not None:
        # Check distance between old point and new point.
        if distance > threshold:
            validated = False
            print("The geocoordinates from Geomancer are too far ({distance} ft) from the original geocoordinates.")

    if validated:
        return validated, address_object
    return validated, None, None, None, None, None, None, None
# Actually, return a dict instead.
