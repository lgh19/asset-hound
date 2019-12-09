from django.shortcuts import render
from rest_framework import viewsets

from assets.models import Asset
from assets.serializers import AssetSerializer


class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer

