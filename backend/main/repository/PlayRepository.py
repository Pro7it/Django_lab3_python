from .BaseRepository import BaseRepository
from main.models import *

class PlayRepository(BaseRepository):
    def __init__(self):
        super().__init__(Play)

    def update(self, instance, **kwargs):
        actors = kwargs.pop("actors", None)
        directors = kwargs.pop("directors", None)

        for field, value in kwargs.items():
            setattr(instance, field, value)

        if actors is not None:
            instance.actors.set(actors)  

        if directors is not None:
            instance.directors.set(directors)  

        instance.save()
        return instance
    
    def create(self, **kwargs):
        try:
            actors = kwargs.pop("actors", None)
            directors = kwargs.pop("directors", None)

            e = self.model(**kwargs)
            e.save()
            if actors is not None:
                e.actors.set(actors)
            if directors is not None:  
                e.directors.set(directors)
            return e
        except Exception as exc:
            print("Error:", exc)
            return None