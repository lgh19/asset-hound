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

def list_of(named_things):
    # This converts ManyToManyField values back to a list.
    return [t.name for t in named_things.all()]

def handle_uploaded_file(f, mode):
    import csv
    results = []

    if f.size > 2500000:
        raise ValueError("handle_uploaded_file hasn't implemented saving the file for reading/parsing yet.")
        #for chunk in f.chunks(): # "Looping over chunks() instead of using read()
        #    # ensures that large files don't overwhelm your system's memory.
        #    destination.write(chunk)
    else:
        decoded_file = f.read().decode('utf-8').splitlines()
        reader = csv.DictReader(decoded_file)
        for row in reader:
            raw_id = row['id']
            primary_raw_asset_iterator = RawAsset.objects.filter(id = raw_id)
            assert len(primary_raw_asset_iterator) == 1 # To ensure it exists in the database.
            primary_raw_asset = primary_raw_asset_iterator[0]

            ids_to_merge = row['ids_to_merge']
            raw_ids = [int(i) for i in ids_to_merge.split('+')]
            raw_assets_iterator = RawAsset.objects.filter(id__in = raw_ids)
            assert len(raw_assets_iterator) > 0 # To ensure some exist in the database.
            raw_assets = list(raw_assets_iterator)

            asset_id = row['asset_id']
            destination_asset_iterator = Asset.objects.filter(id = asset_id)
            assert len(destination_asset_iterator) == 1 # To ensure it exists in the database.
            destination_asset = destination_asset_iterator[0]

            more_results = [f"Preparing to link raw assets with IDs {[r.id for r in raw_assets]} and names {[r.name for r in raw_assets]} to asset with PREVIOUS name {destination_asset.name}."]

            if mode == 'validate':
                more_results.append("(Just validating stuff here.)")

            asset_name = row['name']
            if asset_name != destination_asset.name:
                more_results.append(f"asset_name {'will be ' if mode == 'validate' else ''}changed from {destination_asset.name} to {asset_name}.")
                destination_asset.asset_name = asset_name

            asset_types = row['asset_type'].split('|')
            list_of_old_types = list_of(destination_asset.asset_types)
            if set(asset_types) != set(list_of_old_types):
                more_results.append(f"asset_type {'will be ' if mode == 'validate' else ''}changed from {set(list_of_old_types)} to {set(asset_types)}.")
                try:
                    validated_asset_types = [AssetType.objects.get(name=asset_type) for asset_type in asset_types] # Change get to get_or_create to allow creation of new asset types.
                except assets.models.AssetType.DoesNotExist:
                    more_results.append("Unable to find one of these asset types: {asset_types}.\n ABORTING!!!")
                    break
                finally:
                    destination_asset.asset_types.set(validated_asset_types)

            source_field_name = 'tags'
            new_values = row[source_field_name].split('|')
            list_of_old_values = list_of(destination_asset.tags)
            if set(new_values) != set(list_of_old_values):
                more_results.append(f"{source_field_name} {'will be ' if mode == 'validate' else ''}changed from {set(list_of_old_values)} to {set(new_values)}.")
                validated_values = [Tag.objects.get_or_create(name=value) for value in new_values]
                destination_asset.tags.set(validated_values)

            source_field_name = 'street_address'
            new_value = row[source_field_name]
            old_value = destination_asset.location.street_address
            if new_value != old_value:
                more_results.append(f"{source_field_name} {'will be ' if mode == 'validate' else ''}changed from {old_value} to {new_value}.")
                destination_asset.location.street_address = new_value

            if mode == 'update':
                more_results.append("ACTUALLY ABOUT TO DO IT (after some code changes).")
                #destination_asset.save()
                #raw_assets.save()

            results += more_results

    return results

def upload_file(request):
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            if 'validate' in request.POST: # The user hit the "Validate" button:
                mode = "validate"
            else:
                mode = "update"
            results = handle_uploaded_file(request.FILES['file'], mode)
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
