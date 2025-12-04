from django.urls import include, path
from rest_framework import routers
from . import views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from django.conf import settings
from django.conf.urls.static import static

router = routers.DefaultRouter()
router.register(r"actors", views.ActorViewSet, basename="actor")
router.register(r"directors", views.DirectorViewSet, basename="director")
router.register(r"genres", views.GenreViewSet, basename="genre")
router.register(r"halls", views.HallViewSet, basename="hall")
router.register(r"plays", views.PlayViewSet, basename="play")
router.register(r"schedules", views.ScheduleViewSet, basename="schedule")
router.register(r"theaters", views.TheatreViewSet, basename="theatre")
router.register(r"tickets", views.TicketViewSet, basename="ticket")
router.register(r"users", views.UserViewSet, basename="users")

urlpatterns = [
    path("api/", include(router.urls)),
    path('login/', views.MyTokenObtainPairView.as_view()),
    path('login/refresh/', TokenRefreshView.as_view()),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)