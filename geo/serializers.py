from rest_framework_gis.serializers import (
    GeoFeatureModelSerializer,
    GeometrySerializerMethodField,
)
from geo.models import Geography


class GeographySerializer(GeoFeatureModelSerializer):
    geom = GeometrySerializerMethodField()

    class Meta:
        model = Geography
        geo_field = 'geom'
        fields = [
            'name',
            'description',
        ]
