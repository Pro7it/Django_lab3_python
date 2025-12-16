# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.auth.models import AbstractUser 


class Actor(models.Model):
    actor_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    birthdate = models.DateField(blank=True, null=True)

    class Meta:
        db_table = 'Actor'

    def __str__(self):
        return f'{self.name}\n'


class Director(models.Model):
    director_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    birthdate = models.DateField(blank=True, null=True)
    biography = models.TextField(blank=True, null=True)
    awards = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'Director'

    def __str__(self):
        return f'{self.name}\n'


class Genre(models.Model):
    genre_id = models.AutoField(primary_key=True)
    name = models.CharField(unique=True, max_length=50)
    description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'Genre'

    def __str__(self):
        return f'{self.name}: {self.description}\n'

class Play(models.Model):
    play_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    genre = models.ForeignKey(Genre, models.CASCADE, blank=True, null=True)
    duration = models.IntegerField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    author = models.CharField(max_length=100, blank=True, null=True)
    actors = models.ManyToManyField('Actor', through='PlayActor', related_name='plays')
    directors = models.ManyToManyField('Director', through='PlayDirector', related_name='plays')
    image = models.ImageField(upload_to="plays", null=True, blank=True)
    
    class Meta:
        db_table = 'Play'

    def __str__(self):
        return f'{self.name}, {self.author} - {self.description}\n'

class Hall(models.Model):
    hall_id = models.AutoField(primary_key=True)
    theatre = models.ForeignKey('Theatre', models.CASCADE)
    name = models.CharField(max_length=50)
    capacity = models.IntegerField()

    class Meta:
        db_table = 'Hall'
        unique_together = (('theatre', 'name'),)

    def __str__(self):
        return f'{self.name} ({self.capacity}) - {self.theatre}\n'

class PlayActor(models.Model):
    pk = models.CompositePrimaryKey('play_id', 'actor_id')
    play = models.ForeignKey(Play, models.CASCADE)
    actor = models.ForeignKey(Actor, models.CASCADE)
    role = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        db_table = 'PlayActor'


class PlayDirector(models.Model):
    pk = models.CompositePrimaryKey('play_id', 'director_id')
    play = models.ForeignKey(Play, models.CASCADE)
    director = models.ForeignKey(Director, models.CASCADE)

    class Meta:
        db_table = 'PlayDirector'


class Schedule(models.Model):
    schedule_id = models.AutoField(primary_key=True)
    play = models.ForeignKey(Play, models.CASCADE)
    hall = models.ForeignKey(Hall, models.CASCADE)
    date = models.DateField(blank=True, null=True)
    time = models.TimeField(blank=True, null=True)

    class Meta:
        db_table = 'Schedule'
        unique_together = (('play', 'hall', 'date', 'time'),)

    def __str__(self):
        return f'{self.play}\n {self.hall}, {self.date}, {self.time}\n'


class Theatre(models.Model):
    theatre_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    city = models.CharField(max_length=20)
    address = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True, null=True)
    website = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = 'Theatre'
        unique_together = (('name', 'city'),)

    def __str__(self):
        return f'{self.name} ({self.city})\n'


class Ticket(models.Model):
    ticket_id = models.AutoField(primary_key=True)
    schedule = models.ForeignKey(Schedule, models.CASCADE)
    seat = models.CharField(max_length=20)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        db_table = 'Ticket'
        unique_together = (('schedule_id', 'seat'),)

    def __str__(self):
        return f'{self.seat}\n'


class User(AbstractUser):
    username = models.CharField(max_length=60, null=False, unique=True)
    email = models.EmailField(null=False, unique=True)
        
    first_name = None
    last_name = None
    date_joined = None

    gender = models.CharField(max_length=20, null=True, blank=True)
    birthdate = models.DateField(null=True)
    liked_plays = models.ManyToManyField("Play", related_name="liked_by", blank=True)
    rated_plays = models.ManyToManyField("Play", through="PlayRating", related_name="ratings")
    
    # по ньому буде йти логін
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

class PlayRating(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    play = models.ForeignKey("Play", on_delete=models.CASCADE)
    rating = models.IntegerField()
    class Meta:
        unique_together = (("user", "play"),)
