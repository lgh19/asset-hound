from rest_framework import viewsets, filters
from rest_framework.pagination import LimitOffsetPagination

from assets.models import Asset, AssetType, Category
from assets.serializers import AssetSerializer, AssetGeoJsonSerializer, AssetListSerializer, AssetTypeSerializer, \
    CategorySerializer


class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all()
    pagination_class = LimitOffsetPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', ]

    def get_serializer_class(self, *args, **kwargs):
        fmt = self.request.GET.get('fmt', None)
        if fmt in ('geojson', 'geo'):
            return AssetGeoJsonSerializer
        if self.action == 'list':
            return AssetListSerializer
        return AssetSerializer


class AssetTypeViewSet(viewsets.ModelViewSet):
    queryset = AssetType.objects.all()
    serializer_class = AssetTypeSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
