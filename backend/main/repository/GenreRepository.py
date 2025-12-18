from .BaseRepository import BaseRepository
from main.models import *
from django.db.models import *
from django.db.models.functions import ExtractYear
from django.utils.timezone import now


class GenreRepository(BaseRepository):
    def __init__(self):
        super().__init__(Genre)

    def stats(self):
        return (
            Play.objects
            .select_related("genre")
            .values_list("genre__name", flat=True)
        )
    
    def stats_actor(self):
        qs = self.model.objects.values("name").annotate(
            amount=Count("play__play_id"),
            avg_actors_age=Avg(ExtractYear(now()) - ExtractYear("play__actors__birthdate")),
        )
        return qs
