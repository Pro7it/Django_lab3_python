from .BaseRepository import BaseRepository
from main.models import *
from django.db.models import *


class GenreRepository(BaseRepository):
    def __init__(self):
        super().__init__(Genre)

    def stats(self):
        qs = self.model.objects.values("name").annotate(
            amount=Count("play__play_id"), avg_actors_age=Avg("play__actors__actor_id")
        )
        return qs
