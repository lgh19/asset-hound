# -*- coding: utf-8 -*-
from django.contrib import admin

from .models import (AssetType,
                     Tag,
                     Location, HistoricalLocation,
                     Organization, HistoricalOrganization,
                     ProvidedService,
                     TargetPopulation,
                     DataSource,
                     Asset, HistoricalAsset,
                     RawAsset, HistoricalRawAsset,
                     Category)


@admin.register(AssetType)
class AssetTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'title', 'category')
    search_fields = ('name',)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'geom',
    )
    raw_id_fields = ('parent_location',)
    search_fields = ('name',)

@admin.register(HistoricalLocation)
class HistoricalLocationAdmin(admin.ModelAdmin):
    list_display = ('id', 'history_id', 'history_type', 'history_date', 'history_change_reason')
    #search_fields = ('name',)


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'location', 'email', 'phone')
    list_filter = ('location',)
    search_fields = ('name',)

@admin.register(HistoricalOrganization)
class HistoricalOrganizationAdmin(admin.ModelAdmin):
    list_display = ('id', 'history_id', 'history_type', 'history_date', 'history_change_reason')
    #search_fields = ('name',)


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
        # 'localizability',
        'location',
        # 'url',
        # 'email',
        # 'phone',
        # 'hours_of_operation',
        # 'holiday_hours_of_operation',
        # 'child_friendly',
        # 'capacity',
        # 'internet_access',
        # 'wifi_network',
        # 'computers_available',
        # 'open_to_public',
        # 'sensitive',
        'date_entered',
        'last_updated',
        'data_source',
        'primary_key_from_rocket',
    )
    # list_filter = (
    #     'organization',
    #     'location',
    #     'child_friendly',
    #     'internet_access',
    #     'computers_available',
    #     'open_to_public',
    #     'sensitive',
    #     'date_entered',
    #     'last_updated',
    #     'data_source',
    # )
    autocomplete_fields = (
        'location',
        'asset_types',
        'tags',
        'services',
        'hard_to_count_population',
    )
    search_fields = ('name',)

@admin.register(HistoricalAsset)
class HistoricalAssetAdmin(admin.ModelAdmin):
    list_display = ('id', 'history_id', 'history_type', 'history_date', 'history_change_reason')
    #search_fields = ('name',)


@admin.register(RawAsset)
class RawAssetAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        #'organization',
        # 'localizability',
        'street_address',
        'city',
        'state',
        'zip_code',
        'latitude',
        'longitude',
        # 'url',
        # 'email',
        # 'phone',
        # 'hours_of_operation',
        # 'holiday_hours_of_operation',
        # 'child_friendly',
        # 'capacity',
        # 'internet_access',
        # 'wifi_network',
        # 'computers_available',
        # 'open_to_public',
        # 'sensitive',
        'date_entered',
        'last_updated',
        'data_source',
        'primary_key_from_rocket',
    )
    # list_filter = (
    #     'organization',
    #     'location',
    #     'child_friendly',
    #     'internet_access',
    #     'computers_available',
    #     'open_to_public',
    #     'sensitive',
    #     'date_entered',
    #     'last_updated',
    #     'data_source',
    # )
    autocomplete_fields = (
        'asset_types',
        'tags',
        'services',
        'hard_to_count_population',
    )
    search_fields = ('name', 'street_address', 'city', 'zip_code')

@admin.register(HistoricalRawAsset)
class HistoricalRawAssetAdmin(admin.ModelAdmin):
    list_display = ('id', 'history_id', 'history_type', 'history_date', 'history_change_reason')
    #search_fields = ('name',)

class AssetTypeInline(admin.TabularInline):
    model = AssetType


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', ]
    search_fields = ['name', ]
