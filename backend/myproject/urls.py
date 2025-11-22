from django.contrib import admin
from django.urls import path, include
from main.swagger import schema_view
urlpatterns = [
    path('', include('main.urls')),
    path('admin/', admin.site.urls),
    path('swagger/', schema_view.with_ui('swagger',
                                         cache_timeout=0),
    name='schmea-swagger-ui')
]
