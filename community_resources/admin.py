from django.contrib import admin

from .models import Resource, Community, ResourceCategory, CategorySection, Population


@admin.register(ResourceCategory)
class ResourceCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description')
    search_fields = ('name',)
    list_display_links = ('name',)


@admin.register(Population)
class PopulationAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description')
    list_display_links = ('name',)

    search_fields = ('name',)


@admin.register(CategorySection)
class CategorySectionAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'id', 'community', 'category')
    list_display_links = ('__str__',)
    list_filter = ('community', 'category')


class CategorySectionInline(admin.StackedInline):
    model = CategorySection
    extra = 1


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'website',
        'phone_number',
        'priority',
        'published',
        'start_date',
        'stop_date',
    )
    list_display_links = ('name',)

    list_filter = ('published', 'start_date', 'stop_date')
    autocomplete_fields = (
        'assets',
        'other_locations',
    )
    search_fields = ('name',)


@admin.register(Community)
class CommunityAdmin(admin.ModelAdmin):
    list_display = ('name', 'id',)
    list_display_links = ('name',)
    list_select_related = True
    autocomplete_fields = ('resources',)
    search_fields = ('name',)
    inlines = (CategorySectionInline,)
