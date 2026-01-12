from .BaseRepository import BaseRepository
from main.models import *
from django.db.models import *
from django.db.models.functions import ExtractYear
from django.utils.timezone import now


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
 
    def toggle_like(self, user, play_id):
        play = Play.objects.get(pk=play_id)

        if play in user.liked_plays.all():
            user.liked_plays.remove(play)
            return False
        else:
            user.liked_plays.add(play)
            return True

    def stats_default(self):
        qs = (self.model.objects.values("play_id", "name", genre_name=F("genre__name"))
            .annotate(
                actors_amount=Count("actors__actor_id", distinct=True),
                likes_amount=Count("liked_by__email", distinct=True),
                rating=Avg("playrating__rating"),
                avg_ticket_price=Avg("schedule__ticket__price"),
                ticked_sold_amount=Count("schedule__ticket__ticket_id", filter=Q(schedule__ticket__status="проданий")),
                ticked_free_amount=Count("schedule__ticket__ticket_id", filter=Q(schedule__ticket__status="вільний")),
                avg_actors_age=Avg(ExtractYear(now()) - ExtractYear("actors__birthdate"))
            )
        )
        return qs
    
    def stats_for_avg_actors_age(self):
        qs = (self.model.objects.values("play_id", "name", genre_name=F("genre__name"))
            .annotate(
                avg_actors_age=Avg(ExtractYear(now()) - ExtractYear("actors__birthdate"))
            )
        )
        return qs

    def save_user_rating(self, user, play_id, rating_value):
        play = Play.objects.get(pk=play_id)
        return PlayRating.objects.update_or_create(
            user=user,
            play=play,
            defaults={"rating": rating_value}
        )
    
    def stats_plays_rating(self):
        qs = self.model.objects.values(rating=F("playrating__rating")).annotate(
            ratings_count = Count("play_id")
        )
        
        return qs


