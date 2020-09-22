from django.urls import re_path

from assets.views import upload_file, request_asset_dump

urlpatterns = []

# These are supposed to be URLs that look like
#    https://assets.wprdc.org/edit/update-assets/
# and that handle bulk database edits.
urlpatterns = [
    re_path(r'^update-assets/<using>/', upload_file, name='update-assets'),
    re_path(r'^dump_assets/', request_asset_dump, name='request_asset_dump'),
]
