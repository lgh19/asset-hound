from rest_framework import serializers

from assets.serializers import AssetSerializer, LocationSerializer
from community_resources.models import Resource, ResourceCategory, Population, Community, CategorySection
from geo.serializers import GeographySerializer
from geo.models import Neighborhood


class ResourceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceCategory
        fields = ['name', 'slug', 'description', 'image']


class CategorySectionSerializer(serializers.ModelSerializer):
    category = ResourceCategorySerializer()

    class Meta:
        model = CategorySection
        fields = ['category', 'content']


class PopulationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Population
        fields = ['name', 'slug', 'description']


class ResourceSerializer(serializers.ModelSerializer):
    categories = ResourceCategorySerializer(many=True)
    populations_served = PopulationSerializer(many=True)
    locations = LocationSerializer(many=True)

    class Meta:
        model = Resource
        fields = [
            'name',
            'slug',
            'description',
            'website',
            'phone_number',
            'email',
            'categories',
            'populations_served',
            'locations',
            'recurrence',
            'priority',
            'published',
            'start_date',
            'stop_date',
        ]


class NeighborhoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Neighborhood
        fields = ['name', ]


class CommunitySerializer(serializers.ModelSerializer):
    # neighborhoods = GeographySerializer(many=True)
    neighborhoods = NeighborhoodSerializer(many=True)

    resources = ResourceSerializer(many=True)
    resource_categories = ResourceCategorySerializer(many=True)
    category_sections = CategorySectionSerializer(many=True)

    class Meta:
        model = Community
        fields = [
            'name',
            'slug',
            'neighborhoods',
            'resource_categories',
            'top_section_content',
            'alert_content',
            'category_sections',
            'resources',
        ]
