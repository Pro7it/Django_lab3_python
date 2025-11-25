from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class ActorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actor
        fields = "__all__"


class DirectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Director
        fields = "__all__"


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = "__all__"

class PlaySerializer(serializers.ModelSerializer):
    # actors = serializers.PrimaryKeyRelatedField(queryset=Actor.objects.all(), many=True)
    # directors = serializers.PrimaryKeyRelatedField(queryset=Director.objects.all(), many=True)
    directors = DirectorSerializer(many=True, read_only=True)
    actors = ActorSerializer(many=True, read_only=True)
    genre = GenreSerializer(read_only=True)
    image = serializers.ImageField(required=False, allow_null=True)

    #TODO: додати унікальні назви, побудовані на id + розширення файлу, а також видаляти дублювання

    director_ids = serializers.PrimaryKeyRelatedField(many=True, queryset=Director.objects.all(), write_only=True)
    actor_ids = serializers.PrimaryKeyRelatedField(many=True, queryset=Actor.objects.all(), write_only=True)
    genre_id = serializers.PrimaryKeyRelatedField(queryset=Genre.objects.all(), write_only=True)

    class Meta:
        model = Play
        fields = "__all__"

    def create(self, validated_data):
        actor_ids = validated_data.pop("actor_ids", [])
        director_ids = validated_data.pop("director_ids", [])
        genre_instance = validated_data.pop("genre_id", None)

        play = Play.objects.create(genre=genre_instance, **validated_data)
        play.actors.set(actor_ids)
        play.directors.set(director_ids)
        return play

    def update(self, instance, validated_data):
        actor_ids = validated_data.pop("actor_ids", None)
        director_ids = validated_data.pop("director_ids", None)
        genre_instance = validated_data.pop("genre_id", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if genre_instance:
            instance._state.fields_cache.pop("genre", None)
            instance.genre = genre_instance

        instance.save()

        if actor_ids is not None:
            instance.actors.set(actor_ids)
        if director_ids is not None:
            instance.directors.set(director_ids)

        return instance
    


class HallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hall
        fields = "__all__"


class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = "__all__"


class TheatreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theatre
        fields = "__all__"


class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "password"]


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        try:
            data = super().validate(attrs)
        except Exception:

            raise serializers.ValidationError({"error": "WrongData"})

        return data
