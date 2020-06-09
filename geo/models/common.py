from abc import abstractmethod
from typing import List

from django.contrib.gis.db import models

from geo.utils import clean_sql


class Geography(models.Model):
    """
    Base model for all geographic regions
    """

    # Abstract static fields
    geo_level_title: str
    carto_table: str
    carto_geom_field: str = 'the_geom'
    carto_geom_webmercator_field: str = 'the_geom_webmercator'

    # Common instance data fields
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    geom = models.MultiPolygonField()

    @property
    def title(self):
        if self.geo_level_title:
            return f'{self.geo_level_title} {self.name}'
        return self.name

    @property
    def subtitle(self) -> str:
        if self.hierarchy:
            parent = self.hierarchy[-1]  # most likely a city, PGH in our case
            return f'{self.geo_level_title} in {parent.title}'
        return self.geo_level_title

    @property
    def hierarchy(self):
        return []

    @property
    def bbox(self):
        extent = self.geom.extent  # (xmin, ymin, xmax, ymax)
        return [list(extent[0:2]), list(extent[2:4])]

    @property
    def carto_geom_sql(self):
        return clean_sql(f"""
                    SELECT {self.carto_geom_field}
                    FROM {self.carto_table}
                    WHERE {self.carto_geoid_field} = '{self.geoid}'
                    """)

    @property
    def carto_sql(self):
        return clean_sql(f"""
                    SELECT {self.carto_geom_field}, {self.carto_geom_webmercator_field}
                    FROM {self.carto_table}
                    WHERE {self.carto_geoid_field} = '{self.geoid}'
                    """)

    def __str__(self):
        return self.name
