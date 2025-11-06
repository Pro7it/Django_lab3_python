from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r"actors", views.ActorViewSet, basename="actor")
router.register(r"directors", views.DirectorViewSet, basename="director")
router.register(r"genres", views.GenreViewSet, basename="genre")
router.register(r"halls", views.HallViewSet, basename="hall")
router.register(r"plays", views.PlayViewSet, basename="play")
router.register(r"schedules", views.ScheduleViewSet, basename="schedule")
router.register(r"theaters", views.TheatreViewSet, basename="theatre")
router.register(r"tickets", views.TicketViewSet, basename="ticket")

urlpatterns = [
    path("api/", include(router.urls)),
]