# -*- coding: utf-8 -*-
from django.contrib import admin

from .models import (AssetType,
                     Location,
                     Organization,
                     AccessibilityFeature,
                     ProvidedService,
                     TargetPopulation,
                     DataSource,
                     Asset)


@admin.register(AssetType)
class AssetTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'available_transportation',
        'parent_location',
        'geom',
    )
    list_filter = ('parent_location',)
    search_fields = ('name',)


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'location', 'email', 'phone')
    list_filter = ('location',)
    search_fields = ('name',)


@admin.register(AccessibilityFeature)
class AccessibilityFeatureAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


@admin.register(ProvidedService)
class ProvidedServiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


@admin.register(TargetPopulation)
class TargetPopulationAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


@admin.register(DataSource)
class DataSourceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'url')
    search_fields = ('name',)


@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'organization',
        'localizability',
        'location',
        'url',
        'email',
        'phone',
        'hours_of_operation',
        'holiday_hours_of_operation',
        'child_friendly',
        'capacity',
        'internet_access',
        'wifi_network',
        'computers_available',
        'open_to_public',
        'sensitive',
        'date_entered',
        'last_updated',
        'data_source',
    )
    list_filter = (
        'organization',
        'location',
        'child_friendly',
        'internet_access',
        'computers_available',
        'open_to_public',
        'sensitive',
        'date_entered',
        'last_updated',
        'data_source',
    )
    autocomplete_fields = (
        'asset_types',
        'accessibility_features',
        'services',
        'hard_to_count_population',
    )
    search_fields = ('name',)
