from django.urls import re_path

from rest_framework import routers

from assets.views import AssetViewSet, AssetTypeViewSet, CategoryViewSet, upload_file

# register DRF Views and ViewSets
router = routers.DefaultRouter()
router.register(r'assets', AssetViewSet)
router.register(r'asset-types', AssetTypeViewSet)
router.register(r'categories', CategoryViewSet)

urlpatterns = []

# appends registered API urls to `urlpatterns`
urlpatterns += router.urls
