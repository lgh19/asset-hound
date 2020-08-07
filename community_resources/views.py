from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from rest_framework import viewsets, filters
from rest_framework.pagination import LimitOffsetPagination

from community_resources.models import Community, Resource
from community_resources.serializers import CommunitySerializer, ResourceSerializer

CACHE_TTL = 15 * 60  # 15 mins


class CommunityViewSet(viewsets.ModelViewSet):
    queryset = Community.objects.all()
    pagination_class = LimitOffsetPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', ]
    serializer_class = CommunitySerializer

    # @method_decorator(cache_page(CACHE_TTL))
    def retrieve(self, request, *args, **kwargs):
        return super(CommunityViewSet, self).retrieve(request, *args, **kwargs)


class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    pagination_class = LimitOffsetPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', ]
    serializer_class = ResourceSerializer
