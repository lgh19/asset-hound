import os
from django.contrib.gis.utils import LayerMapping
from geo import models


DATA_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    '../../data',
)

mappings = {
    'block_group': {
        'model': models.BlockGroup,
        'level': models.Geography.BLOCK_GROUP,
        'file_name': 'cb_2017_42_bg_500k',
        'mapping': {
            'name': 'NAME',
            'geom': 'MULTIPOLYGON',
            'geoid': 'GEOID',
            'statefp': 'STATEFP',
            'countyfp': 'COUNTYFP',
            'tractce': 'TRACTCE',
            'blkgrpce': 'BLKGRPCE',
            'affgeoid': 'AFFGEOID',
            'lsad': 'LSAD',
            'aland': 'ALAND',
            'awater': 'AWATER',
        }
    },
    'tract': {
        'model': models.Tract,
        'level': models.Geography.TRACT,
        'file_name': 'cb_2017_42_tract_500k',
        'mapping': {
            'name': 'NAME',
            'geom': 'MULTIPOLYGON',
            'geoid': 'GEOID',
            'statefp': 'STATEFP',
            'countyfp': 'COUNTYFP',
            'tractce': 'TRACTCE',
            'affgeoid': 'AFFGEOID',
            'aland': 'ALAND',
            'awater': 'AWATER',
        }
    },
    'county_subdivision': {
        'model': models.CountySubdivision,
        'level': models.Geography.COUNTY_SUBDIVISION,
        'file_name': 'cb_2017_42_cousub_500k',
        'mapping': {
            'name': 'NAME',
            'geom': 'MULTIPOLYGON',
            'geoid': 'GEOID',
            'statefp': 'STATEFP',
            'countyfp': 'COUNTYFP',
            'cousubfp': 'COUSUBFP',
            'cousubns': 'COUSUBNS',
            'affgeoid': 'AFFGEOID',
            'aland': 'ALAND',
            'awater': 'AWATER',
        }
    },
    'place': {
        'model': models.Place,
        'level': models.Geography.PLACE,
        'file_name': 'cb_2017_42_place_500k',
        'mapping': {
            'name': 'NAME',
            'geom': 'MULTIPOLYGON',
            'geoid': 'GEOID',
            'statefp': 'STATEFP',
            'placefp': 'PLACEFP',
            'placens': 'PLACENS',
            'affgeoid': 'AFFGEOID',
            'aland': 'ALAND',
            'awater': 'AWATER',
        }
    },
    'puma': {
        'model': models.Puma,
        'level': models.Geography.PUMA,
        'file_name': 'cb_2017_42_puma10_500k',
        'mapping': {
            'name': 'NAME10',
            'geom': 'MULTIPOLYGON',
            'geoid': 'GEOID10',
            'statefp': 'STATEFP10',
            'pumace': 'PUMACE10',
            'affgeoid': 'AFFGEOID10',
            'aland': 'ALAND10',
            'awater': 'AWATER10',
        }
    },
    'school_district': {
        'model': models.SchoolDistrict,
        'level': models.Geography.SCHOOL_DISTRICT,
        'file_name': 'cb_2017_42_unsd_500k',
        'mapping': {
            'name': 'NAME',
            'geom': 'MULTIPOLYGON',
            'geoid': 'GEOID',
            'statefp': 'STATEFP',
            'unsdlea': 'UNSDLEA',
            'affgeoid': 'AFFGEOID',
            'aland': 'ALAND',
            'awater': 'AWATER',
        }
    },
    'state_house': {
        'model': models.StateHouse,
        'level': models.Geography.STATE_HOUSE,
        'file_name': 'cb_2017_42_sldl_500k',
        'mapping': {
            'name': 'NAME',
            'geom': 'MULTIPOLYGON',
            'geoid': 'GEOID',
            'statefp': 'STATEFP',
            'sldlst': 'SLDLST',
            'affgeoid': 'AFFGEOID',
            'aland': 'ALAND',
            'awater': 'AWATER',
        }
    },
    'state_senate': {
        'model': models.StateSenate,
        'level': models.Geography.STATE_SENATE,
        'file_name': 'cb_2017_42_sldu_500k',
        'mapping': {
            'name': 'NAME',
            'geom': 'MULTIPOLYGON',
            'geoid': 'GEOID',
            'statefp': 'STATEFP',
            'sldust': 'SLDUST',
            'affgeoid': 'AFFGEOID',
            'aland': 'ALAND',
            'awater': 'AWATER',
        }
    },
    'county': {
        'model': models.County,
        'level': models.Geography.COUNTY,
        'file_name': 'cb_2017_us_county_500k',
        'mapping': {
            'name': 'NAME',
            'geom': 'MULTIPOLYGON',
            'geoid': 'GEOID',
            'statefp': 'STATEFP',
            'countyfp': 'COUNTYFP',
            'countyns': 'COUNTYNS',
            'affgeoid': 'AFFGEOID',
            'lsad': 'LSAD',
            'aland': 'ALAND',
            'awater': 'AWATER',
        }
    },

}


def run(ignore=[], only=[], clear_first=True):
    for name, mapping in mappings.items():
        print(name)
        if name in ignore:
            print("--ignored")
            continue

        if only and name not in only:
            print("--skipped")
            continue

        if clear_first:
            print('...truncating table')
            mapping['model'].objects.all().delete()

        lm = LayerMapping(
            mapping['model'],
            os.path.join(DATA_DIR, name, mapping['file_name'] + '.shp'),
            mapping['mapping']
        )
        try:
            l = lm.save(verbose=True, strict=True)
        except Exception as e:
            print(e)
            print(lm)