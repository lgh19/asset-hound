from geo.models import Geography


class LocalGeography(Geography):
    """
    Abstract class for Local Geographies.
    """

    # Abstract Static fields
    wprdc_url: str

    # Common instance data fields

    # Abstract fields and properties

    # Common fields


class Neighborhood(Geography):
    """
    City Neighborhood
    """
    geo_level_title = 'Neighborhood'
    carto_table = 'pgh_neighborhoods'

    wprdc_url = 'https://data.wprdc.org/dataset/neighborhoods1'
