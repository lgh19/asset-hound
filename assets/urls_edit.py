from django.urls import path, re_path

from assets.views import upload_file, request_asset_dump

urlpatterns = []

# These are supposed to be URLs that look like
#    https://assets.wprdc.org/edit/update-assets/
# and that handle bulk database edits.
urlpatterns = [
    path('update-assets/<using>/', upload_file, name='update-assets'),
    re_path(r'^dump_assets/', request_asset_dump, name='request_asset_dump'),
]
