from abc import abstractmethod
from typing import List

from django.contrib.gis.db import models

from geo.models import Geography
from geo.utils import clean_sql


class CensusGeography(Geography):
    """
    Abstract class for Census Geographies.
    """

    # Abstract static fields
    carto_geoid_field: str = 'geoid'

    # Common instance data fields
    affgeoid = models.CharField(max_length=21, unique=True)
    lsad = models.CharField(max_length=2)
    aland = models.BigIntegerField('Area (land)')
    awater = models.BigIntegerField('Area (water)')

    # Abstract fields and properties
    geoid: models.CharField

    @property
    @abstractmethod
    def census_geo(self) -> dict:
        """dict representing census geography {'for': str, 'in: str} for use in `census` calls """
        raise NotImplementedError


class County(CensusGeography):
    geo_level_title = "County"
    carto_table = 'census_county'

    geoid = models.CharField(max_length=12, primary_key=True)
    statefp = models.CharField(max_length=2)
    countyfp = models.CharField(max_length=5)
    countyns = models.CharField(max_length=8)

    class Meta:
        verbose_name_plural = "Counties"

    @property
    def census_geo(self):
        return {'for': f'county:{self.countyfp}',
                'in': f'state:{self.statefp}'}

    @property
    def title(self):
        return f'{self.name} {self.geo_level_title}'

    def __str__(self):
        return f'{self.name} County'


class Tract(CensusGeography):
    geo_level_title = 'Tract'
    carto_table = "census_tract"

    geoid = models.CharField(max_length=12, primary_key=True)
    statefp = models.CharField(max_length=2)
    countyfp = models.CharField(max_length=3)
    tractce = models.CharField(max_length=6)

    class Meta:
        verbose_name_plural = "Tracts"

    @property
    def hierarchy(self):
        return [County.objects.get(geoid=f'{self.statefp}{self.countyfp}')]

    @property
    def census_geo(self):
        return {'for': f'tract:{self.tractce}',
                'in': f'state:{self.statefp} county:{self.countyfp}'}

    def __str__(self):
        return f'Tract {self.geoid}'


class BlockGroup(CensusGeography):
    geo_level_title = "Block Group"
    carto_table = "census_blockgroup"

    geoid = models.CharField(max_length=12, primary_key=True)
    statefp = models.CharField(max_length=2)
    countyfp = models.CharField(max_length=3)
    tractce = models.CharField(max_length=6)
    blkgrpce = models.CharField(max_length=1)

    @property
    def title(self):
        return f'BlockGroup {self.name}'

    @property
    def hierarchy(self):
        return [County.objects.get(geoid=f'{self.statefp}{self.countyfp}'),
                Tract.objects.get(geoid=f'{self.statefp}{self.countyfp}{self.tractce}')]

    @property
    def census_geo(self):
        return {'for': f'block group:{self.blkgrpce}',
                'in': f'state:{self.statefp} county:{self.countyfp} tract:{self.tractce}'}

    def __str__(self):
        return f'Block Group {self.geoid}'

    class Meta:
        verbose_name_plural = "Block Groups"


class CountySubdivision(CensusGeography):
    geo_level_title = 'County Subdivision'
    carto_table = "census_county_subdivision"

    geoid = models.CharField(max_length=12, primary_key=True)

    statefp = models.CharField(max_length=2)
    countyfp = models.CharField(max_length=3)
    cousubfp = models.CharField(max_length=5)
    cousubns = models.CharField(max_length=8)

    @property
    def title(self):
        return f'{self.name}'

    @property
    def hierarchy(self):
        return [County.objects.get(geoid=f'{self.statefp}{self.countyfp}')]

    @property
    def census_geo(self):
        return {'for': f'county subdivision:{self.cousubfp}',
                'in': f'state:{self.statefp} county:{self.countyfp}'}

    class Meta:
        verbose_name_plural = "County Subdivisions"

    def __str__(self):
        return f'County Subdivision {self.geoid}'


# todo: finish these guys
class Place(CensusGeography):
    geo_level_title = 'Place'
    carto_table = 'census_place'

    geoid = models.CharField(max_length=12, primary_key=True)

    statefp = models.CharField(max_length=2)
    placefp = models.CharField(max_length=5)
    placens = models.CharField(max_length=8)

    @property
    def census_geo(self):
        return {'for': f'tract:{self.placefp}',
                'in': f'state:{self.statefp}'}

    class Meta:
        verbose_name_plural = "Places"

    def __str__(self):
        return f'Place {self.geoid}'


class Puma(CensusGeography):
    geo_level_title = "PUMA"
    carto_table = 'census_puma'

    geoid = models.CharField(max_length=12, primary_key=True)

    statefp = models.CharField(max_length=2)
    pumace = models.CharField(max_length=5)

    @property
    def census_geo(self):
        return {'for': f'tract:{self.pumace}',
                'in': f'state:{self.statefp}'}

    class Meta:
        verbose_name = "PUMA"
        verbose_name_plural = "PUMAS"

    def __str__(self):
        return f'PUMA {self.geoid}'


class SchoolDistrict(CensusGeography):
    geo_level_title = "School District"
    carto_table = 'census_school_districts'

    geoid = models.CharField(max_length=12, primary_key=True)

    statefp = models.CharField(max_length=2)
    unsdlea = models.CharField(max_length=5)
    placens = models.CharField(max_length=8)

    @property
    def census_geo(self):
        return {'for': f'tract:{self.unsdlea}',
                'in': f'state:{self.statefp}'}

    class Meta:
        verbose_name_plural = "School Districts"

    def __str__(self):
        return f'{self.name} School District - {self.geoid}'


class StateHouse(CensusGeography):
    geo_level_title = "State House"
    carto_table = 'census_pa_house'

    geoid = models.CharField(max_length=12, primary_key=True)

    statefp = models.CharField(max_length=2)
    sldlst = models.CharField(max_length=5)

    lsy = models.CharField(max_length=4)

    @property
    def census_geo(self):
        return {'for': f'tract:{self.sldlst}',
                'in': f'state:{self.statefp}'}

    class Meta:
        verbose_name = "State House District"
        verbose_name_plural = "State House Districts"

    def __str__(self):
        return f'State House - {self.geoid}'


class StateSenate(CensusGeography):
    geo_level_title = "State Senate"
    carto_table = 'census_pa_senate'

    geoid = models.CharField(max_length=12, primary_key=True)

    statefp = models.CharField(max_length=2)
    sldust = models.CharField(max_length=5)

    lsy = models.CharField(max_length=4)

    @property
    def census_geo(self):
        return {'for': f'tract:{self.sldust}',
                'in': f'state:{self.statefp}'}

    class Meta:
        verbose_name = "State Senate District"
        verbose_name_plural = "State Senate Districts"
