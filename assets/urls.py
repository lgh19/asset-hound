from rest_framework import routers

from assets.views import AssetViewSet, AssetTypeViewSet, CategoryViewSet, CSVAssetViewSet

# register DRF Views and ViewSets
router = routers.DefaultRouter()
router.register(r'assets', AssetViewSet)
router.register(r'asset-types', AssetTypeViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'csv-of-assets', CSVAssetViewSet)

urlpatterns = []

# appends registered API urls to `urlpatterns`
urlpatterns += router.urls
