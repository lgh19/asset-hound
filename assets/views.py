from rest_framework import viewsets, filters
from rest_framework.pagination import LimitOffsetPagination

from rest_framework.settings import api_settings
#from rest_framework_csv.renderers import CSVRenderer

from assets.models import RawAsset, Asset, AssetType, Category
from assets.serializers import AssetSerializer, AssetGeoJsonSerializer, AssetListSerializer, AssetTypeSerializer, \
    CategorySerializer


from django.http import HttpResponseRedirect
from django.shortcuts import render
from assets.forms import UploadFileForm

def handle_uploaded_file(f):
    import csv
    results = []

    if f.size > 2500000:
        raise ValueError("handle_uploaded_file hasn't implemented saving the file for reading/parsing yet.")
        #for chunk in f.chunks(): # "Looping over chunks() instead of using read()
        #    # ensures that large files don't overwhelm your system's memory.
        #    destination.write(chunk)
    else:
        reader = csv.DictReader(f)
        for row in reader:
            raw_id = row['id']
            primary_raw_asset_iterator = RawAsset.objects.filter(id = raw_id)
            assert len(primary_raw_asset_iterator) == 1 # To ensure it exists in the database.
            primary_raw_asset = primary_raw_asset_iterator[0]

            ids_to_merge = row['ids_to_merge']
            raw_assets_iterator = RawAsset.objects.filter(id = ids_to_merge)
            assert len(raw_assets_iterator) > 0 # To ensure they exist in the database.
            raw_assets = list(raw_assets_iterator)

            asset_id = row['asset_id']
            destination_asset_iterator = Asset.objects.filter(id = asset_id)
            assert len(destination_asset_iterator) == 1 # To ensure it exists in the database.
            destination_asset = destination_asset_iterator[0]

            result = f"Preparing to link raw assets with IDs {[r.id for r in raw_assets]} and names {r.name for r in raw_assets]} to asset with PREVIOUS name {asset_id.name}."
            results.append(result)

    return results

def upload_file(request):
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            results = handle_uploaded_file(request.FILES['file'])
            return render(request, 'update.html', {'form': form, 'results': results})
    else:
        form = UploadFileForm()
    return render(request, 'update.html', {'form': form, 'results': []})


class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all()
    pagination_class = LimitOffsetPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['name',]

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
