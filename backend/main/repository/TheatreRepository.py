from .BaseRepository import BaseRepository
from main.models import *
from django.db.models import *
from django.db.models.functions import *


class TheatreRepository(BaseRepository):
    def __init__(self):
        super().__init__(Theatre)

    def rating(self):
        return self.model.objects.annotate(rating=Avg("hall__schedule__play__playrating__rating")).order_by("-rating")
