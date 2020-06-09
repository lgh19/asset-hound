from enum import Enum

from django.contrib.gis.db import models

from .common import Geography

from .local import Neighborhood

from .census import (
    CensusGeography,
    BlockGroup,
    Tract,
    County,
    CountySubdivision,
    Place,
    Puma,
    StateHouse,
    SchoolDistrict,
    StateSenate,
)

