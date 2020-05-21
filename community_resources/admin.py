from django.contrib import admin

from .models import Resource, Community, ResourceCategory, CategorySection


@admin.register(ResourceCategory)
class ResourceCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description')
    search_fields = ('name',)


@admin.register(CategorySection)
class CategorySectionAdmin(admin.ModelAdmin):
    list_display = ('id', 'community', 'category', 'content')
    list_filter = ('community', 'category')


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description')
    autocomplete_fields = ('assets', 'other_locations')
    search_fields = ('name',)


@admin.register(Community)
class CommunityAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    autocomplete_fields = ('resources',)
    search_fields = ('name',)
