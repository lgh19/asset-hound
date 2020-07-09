from django.urls import re_path

from assets.views import upload_file

urlpatterns = []

urlpatterns = [
    re_path(r'^edit/update-assets/', upload_file, name='update-assets'),
]
