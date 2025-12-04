import django_filters
from .models import Play

class PlayFilter(django_filters.FilterSet):
    genre_name = django_filters.CharFilter(field_name="genre__name", lookup_expr="iexact")

    class Meta:
        model = Play
        fields = ["genre_name"]
