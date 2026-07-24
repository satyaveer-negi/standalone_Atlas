from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import EngineeringJobViewSet, SimulationRunViewSet

router = DefaultRouter()
router.register('jobs', EngineeringJobViewSet, basename='jobs')
router.register('runs', SimulationRunViewSet, basename='runs')

urlpatterns = router.urls
