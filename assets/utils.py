import requests

from asset_hound.settings import GEOCODER_API_KEY


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

