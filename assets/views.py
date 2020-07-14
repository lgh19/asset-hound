from rest_framework import viewsets, filters
from rest_framework.pagination import LimitOffsetPagination

from rest_framework.settings import api_settings
#from rest_framework_csv.renderers import CSVRenderer

from assets.models import RawAsset, Asset, AssetType, Category, Tag, TargetPopulation, ProvidedService, Location, Organization
from assets.serializers import AssetSerializer, AssetGeoJsonSerializer, AssetListSerializer, AssetTypeSerializer, \
    CategorySerializer

from assets.management.commands.load_assets import parse_cell, standardize_phone

from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from assets.forms import UploadFileForm
from assets.utils import distance

def boolify(x): # This differs from the assets.management.commands.load_assets versiion of boolify.
    if x.lower() in ['true', 't']:
        return True
    if x.lower() in ['false', 'f']:
        return False
    return None

def eliminate_empty_strings(xs):
    return [x for x in xs if x != '']

def non_blank_type_or_none(row, field, desired_type): # This could be imported from elsewhere.
    """This function tries to cast the value of row[field] to
    the passed desired type (e.g, float or int). If it fails,
    or if the passed value is an empty string (which is how
    None values are passed by CSVs), it returns None.

    Note that this does not yet support fields like
    PhoneNumberField, URLField, and EmailField."""
    if field in row:
        if row[field] == '':
            return None
        if desired_type == bool:
            return boolify(row[field])
        try:
            return desired_type(row[field])
        except ValueError:
            if desired_type == int:
                try:
                    return int(float(row[field])) # This is necessary to handle
                    # cases where Excel obliviously appends ".0" to integers.
                except ValueError:
                    return None
            return None
    return None

def pipe_delimit(xs):
    return '|'.join([str(x) for x in xs])

def list_of(named_things):
    # This converts ManyToManyField values back to a list.
    return [t.name for t in named_things.all()]

def check_or_update_value(instance, row, mode, more_results, source_field_name, field_type=str):
    if source_field_name not in row:
        return instance, more_results
    new_value = non_blank_type_or_none(row, source_field_name, field_type)

    old_value = getattr(instance, source_field_name)
    if new_value != old_value:
        more_results.append(f"{source_field_name} {'will be ' if mode == 'validate' else ''}changed from {old_value} to {new_value}.")
        setattr(instance, source_field_name, new_value)
    return instance, more_results

def handle_uploaded_file(f, mode):
    import csv
    more_results = []

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

            asset_id = row['asset_id']
            destination_asset_iterator = Asset.objects.filter(id = asset_id)
            assert len(destination_asset_iterator) == 1 # To ensure it exists in the database.
            destination_asset = destination_asset_iterator[0]

            ids_to_merge = row['ids_to_merge']
            if ids_to_merge == '':
                continue # Skip rows with no ids to merge.
            raw_ids = [int(i) for i in ids_to_merge.split('+')]
            raw_assets_iterator = RawAsset.objects.filter(id__in = raw_ids)
            assert len(raw_assets_iterator) > 0 # To ensure some exist in the database.
            raw_assets = list(raw_assets_iterator)
            for raw_asset in raw_assets:
                raw_asset.asset = destination_asset

            location = destination_asset.location
            organization = destination_asset.organization


            if len(raw_assets) == 1:
                summary = f"{'Validating this process: ' if mode == 'validate' else ''}Editing the Asset with id = {asset_id}, previously named {destination_asset.name}, and linking it to RawAsset with id = {raw_assets[0].id} and name = {raw_assets[0].name}."
            else:
                summary = f"{'Validating this process: ' if mode == 'validate' else ''}Merging RawAssets with ids = {', '.join([str(r.id) for r in raw_assets])} and names = {', '.join([r.name for r in raw_assets])} to Asset with id = {asset_id}, previously named {destination_asset.name}."
            more_results.append(summary)

            asset_name = row['name']
            if asset_name != destination_asset.name:
                more_results.append(f"asset_name {'will be ' if mode == 'validate' else ''}changed from {destination_asset.name} to {asset_name}.")
                destination_asset.asset_name = asset_name

            source_field_name = 'asset_type'
            new_values = eliminate_empty_strings(row[source_field_name].split('|'))
            list_of_old_values = list_of(destination_asset.asset_types)
            if set(new_values) != set(list_of_old_values):
                more_results.append(f"asset_type {'will be ' if mode == 'validate' else ''}changed from {pipe_delimit(list_of_old_values)} to {pipe_delimit(new_values)}.")
                if new_values == []:
                    more_results.append(f"asset_type can not be empty\n ABORTING!!!\n<hr>")
                    break
                try:
                    validated_asset_types = [AssetType.objects.get(name=asset_type) for asset_type in new_values] # Change get to get_or_create to allow creation of new asset types.
                    destination_asset.asset_types.set(validated_asset_types)
                except assets.models.AssetType.DoesNotExist:
                    more_results.append(f"Unable to find one of these asset types: {asset_types}.\n ABORTING!!!\n<hr>")
                    break

            source_field_name = 'tags'
            if source_field_name in row:
                new_values = eliminate_empty_strings(row[source_field_name].split('|'))
                list_of_old_values = list_of(destination_asset.tags)
                if set(new_values) != set(list_of_old_values):
                    more_results.append(f"{source_field_name} {'will be ' if mode == 'validate' else ''}changed from {pipe_delimit(list_of_old_values)} to {pipe_delimit(new_values)}.")
                    if new_values == []:
                        destination_asset.tags.clear()
                    else:
                        validated_values = [Tag.objects.get_or_create(name=value)[0] for value in new_values]
                        destination_asset.tags.set(validated_values)

            source_field_name = 'services'
            if source_field_name in row:
                new_values = eliminate_empty_strings(row[source_field_name].split('|'))
                list_of_old_values = list_of(destination_asset.services)
                if set(new_values) != set(list_of_old_values):
                    more_results.append(f"{source_field_name} {'will be ' if mode == 'validate' else ''}changed from {pipe_delimit(list_of_old_values)} to {pipe_delimit(new_values)}.")
                    if new_values == []:
                        destination_asset.services.clear()
                    else:
                        validated_values = [ProvidedService.objects.get_or_create(name=value)[0] for value in new_values]
                        destination_asset.services.set(validated_values)

            source_field_name = 'hard_to_count_population'
            if source_field_name in row:
                new_values = eliminate_empty_strings(row[source_field_name].split('|'))
                list_of_old_values = list_of(destination_asset.hard_to_count_population)
                if set(new_values) != set(list_of_old_values):
                    more_results.append(f"{source_field_name} {'will be ' if mode == 'validate' else ''}changed from {pipe_delimit(list_of_old_values)} to {pipe_delimit(new_values)}.")
                    if new_values == []:
                        destination_asset.hard_to_count_population.clear()
                    else:
                        validated_values = [TargetPopulation.objects.get_or_create(name=value)[0] for value in new_values]
                        destination_asset.hard_to_count_population.set(validated_values)

            # Oddball legacy conversion to be deleted:
            source_field_name = 'accessibility_features'
            if source_field_name in row:
                new_value = row[source_field_name]
                old_value = destination_asset.accessibility
                if new_value != old_value:
                    more_results.append(f"{source_field_name} {'will be ' if mode == 'validate' else ''}changed from {old_value} to {new_value}.")
                    destination_asset.accessibility = boolify(new_value)

            if 'organization_name' in row:
                if row['organization_name'] == '':
                    if ('organization_phone' in row and row['organization_phone'] != '') or ('organization_email' in row and row['organization_email'] != ''):
                        more_results.append(f"The organization's name is a required field if you want to change either the phone or e-mail address (as a check that the correct Organization instance is being updated. ABORTING!!!!\n<hr>.")
                        break
                    else:
                        destination_asset.organization = None # Set ForiegnKey to None.
                        more_results.append(f"&nbsp;&nbsp;&nbsp;&nbsp;Since organization_name == '', the Asset's organization is being set to None and other fields (organization_phone and organization email) are being ignored.")
                else:
                    some_organization_field_changed = False
                    source_field_name = 'organization_name'
                    destination_field_name = 'name'
                    new_value = non_blank_type_or_none(row, source_field_name, str)
                    old_value = organization.name
                    if new_value != old_value:
                        more_results.append(f"{destination_field_name} {'will be ' if mode == 'validate' else ''}changed from {old_value} to {new_value}.")
                        organization.name = new_value
                        some_organization_field_changed = True

                    source_field_name = 'organization_email'
                    if source_field_name in row:
                        destination_field_name = 'email'
                        new_value = non_blank_type_or_none(row, source_field_name, str)
                        old_value = organization.email
                        if new_value != old_value:
                            more_results.append(f"{destination_field_name} {'will be ' if mode == 'validate' else ''}changed from {old_value} to {new_value}.")
                            organization.email = new_value
                            some_organization_field_changed = True

                    source_field_name = 'organization_phone'
                    if source_field_name in row:
                        new_value = non_blank_type_or_none(row, source_field_name, str)
                        old_value = organization.phone
                        if new_value != old_value:
                            more_results.append(f"{destination_field_name} {'will be ' if mode == 'validate' else ''}changed from {old_value} to {new_value}.")
                            organization.phone = standardize_phone(new_value)
                            some_organization_field_changed = True

                    if mode == 'update' and some_organization_field_changed:
                        more_results.append("Updating Organization.")
                        organization.save()


            # I'm choosing to not update the Location.name field here since we may want to manually name Location instances,
            # particularly to deal with cases like the two restaurant locations in Schenley Plaza that have the same
            # street address and parcel ID but slightly different geocoordinates.
            location, more_results = check_or_update_value(location, row, mode, more_results, source_field_name = 'street_address', field_type=str)
            location, more_results = check_or_update_value(location, row, mode, more_results, source_field_name = 'city', field_type=str)
            location, more_results = check_or_update_value(location, row, mode, more_results, source_field_name = 'state', field_type=str)
            location, more_results = check_or_update_value(location, row, mode, more_results, source_field_name = 'zip_code', field_type=str)
            location, more_results = check_or_update_value(location, row, mode, more_results, source_field_name = 'parcel_id', field_type=str)
            location, more_results = check_or_update_value(location, row, mode, more_results, source_field_name = 'residence', field_type=bool)

            if 'latitude' in row or 'longitude' in row:
                old_latitude, old_longitude = location.latitude, location.longitude
            location, more_results = check_or_update_value(location, row, mode, more_results, source_field_name = 'latitude', field_type=float)
            location, more_results = check_or_update_value(location, row, mode, more_results, source_field_name = 'longitude', field_type=float)
            if 'latitude' in row or 'longitude' in row:
                dist = distance(old_latitude, old_longitude, location.latitude, location.longitude)
                more_results.append(f"&nbsp;&nbsp;&nbsp;&nbsp;The distance between the old and new coordinates is {dist:.2f} feet.")

            location, more_results = check_or_update_value(location, row, mode, more_results, source_field_name = 'available_transportation', field_type=str)
            location, more_results = check_or_update_value(location, row, mode, more_results, source_field_name = 'geocoding_properties', field_type=str)
            # Ignore parent location for now.

            destination_asset, more_results = check_or_update_value(destination_asset, row, mode, more_results, source_field_name = 'url', field_type=str)
            destination_asset, more_results = check_or_update_value(destination_asset, row, mode, more_results, source_field_name = 'email', field_type=str)
            source_field_name = 'phone'
            if source_field_name in row:
                new_value = non_blank_type_or_none(row, source_field_name, str)
                old_value = destination_asset.phone
                if new_value != old_value:
                    more_results.append(f"{source_field_name} {'will be ' if mode == 'validate' else ''}changed from {old_value} to {new_value}.")
                    destination_asset.phone = standardize_phone(new_value)
            destination_asset, more_results = check_or_update_value(destination_asset, row, mode, more_results, source_field_name = 'hours_of_operation', field_type=str)
            destination_asset, more_results = check_or_update_value(destination_asset, row, mode, more_results, source_field_name = 'holiday_hours_of_operation', field_type=str)
            destination_asset, more_results = check_or_update_value(destination_asset, row, mode, more_results, source_field_name = 'periodicity', field_type=str)
            destination_asset, more_results = check_or_update_value(destination_asset, row, mode, more_results, source_field_name = 'capacity', field_type=int)
            destination_asset, more_results = check_or_update_value(destination_asset, row, mode, more_results, source_field_name = 'periodicity', field_type=str)
            destination_asset, more_results = check_or_update_value(destination_asset, row, mode, more_results, source_field_name = 'wifi_network', field_type=str)
            destination_asset, more_results = check_or_update_value(destination_asset, row, mode, more_results, source_field_name = 'internet_access', field_type=bool)
            destination_asset, more_results = check_or_update_value(destination_asset, row, mode, more_results, source_field_name = 'computers_available', field_type=bool)
            destination_asset, more_results = check_or_update_value(destination_asset, row, mode, more_results, source_field_name = 'accessibility', field_type=bool)
            destination_asset, more_results = check_or_update_value(destination_asset, row, mode, more_results, source_field_name = 'open_to_public', field_type=bool)
            destination_asset, more_results = check_or_update_value(destination_asset, row, mode, more_results, source_field_name = 'child_friendly', field_type=bool)
            destination_asset, more_results = check_or_update_value(destination_asset, row, mode, more_results, source_field_name = 'do_not_display', field_type=bool)
            destination_asset, more_results = check_or_update_value(destination_asset, row, mode, more_results, source_field_name = 'sensitive', field_type=bool)
            destination_asset, more_results = check_or_update_value(destination_asset, row, mode, more_results, source_field_name = 'localizability', field_type=str)
            destination_asset, more_results = check_or_update_value(destination_asset, row, mode, more_results, source_field_name = 'etl_notes', field_type=str)

            if mode == 'update':
                more_results.append(f"Updating associated Asset, RawAsset, Location, and Organization instances. (This may leave some orphaned.)\n<hr>")
                destination_asset.save()
                location.save()
                for raw_asset in raw_assets:
                    raw_asset.save()
            else:
                more_results.append(f"\n<hr>")

    return more_results

@staff_member_required
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
