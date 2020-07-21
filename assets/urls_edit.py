from django.urls import re_path

from assets.views import upload_file

urlpatterns = []

# These are supposed to be URLs that look like
#    https://assets.wprdc.org/edit/update-assets/
# and that handle bulk database edits.
urlpatterns = [
    re_path(r'^update-assets/', upload_file, name='update-assets'),
]
