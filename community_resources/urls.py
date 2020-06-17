from rest_framework import routers

from community_resources.views import CommunityViewSet, ResourceViewSet

# register DRF Views and ViewSets

router = routers.DefaultRouter()
router.register(r'community', CommunityViewSet)
router.register(r'resource', ResourceViewSet)

urlpatterns = []

# appends registered API urls to `urlpatterns`
urlpatterns += router.urls
