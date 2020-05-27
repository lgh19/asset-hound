from rest_framework import serializers

from assets.serializers import AssetSerializer, LocationSerializer
from community_resources.models import Resource, ResourceCategory, Population, Community
from geo.serializers import GeographySerializer


class ResourceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceCategory
        fields = ['name', 'slug', 'description']


class PopulationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Population
        fields = ['name', 'slug', 'description']


class ResourceSerializer(serializers.ModelSerializer):
    categories = ResourceCategorySerializer(many=True)
    populations_served = PopulationSerializer(many=True)
    assets = AssetSerializer(many=True)
    other_locations = LocationSerializer(many=True)

    class Meta:
        model = Resource
        fields = [
            'name',
            'slug',
            'description',
            'website',
            'phone_number',
            'categories',
            'populations_served',
            'assets',
            'other_locations',
            'recurrence',
            'priority',
            'published',
            'start_date',
            'stop_date',
        ]


class CommunitySerializer(serializers.ModelSerializer):
    neighborhoods = GeographySerializer(many=True)
    resources = ResourceSerializer(many=True)
    resource_categories = ResourceCategorySerializer(many=True)

    class Meta:
        model = Community
        fields = [
            'name',
            'slug',
            'neighborhoods',
            'resource_categories',
            'top_section_content',
            'alert_content',
            'resources',
        ]
