from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import os
from django.conf import settings


def log(line):
    with open("logs.txt", "+a") as f:
        print(line, file=f)
    f.close()


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
    image_file = serializers.ImageField(required=False, allow_null=True)
    image_url = serializers.CharField(required=False, allow_blank=True, write_only=True)

    director_ids = serializers.PrimaryKeyRelatedField(many=True, queryset=Director.objects.all(), write_only=True)
    actor_ids = serializers.PrimaryKeyRelatedField(many=True, queryset=Actor.objects.all(), write_only=True)
    genre_id = serializers.PrimaryKeyRelatedField(queryset=Genre.objects.all(), write_only=True)

    class Meta:
        model = Play
        fields = "__all__"

    def _delete_instance_files(self, id):
        plays_dir = os.path.join(settings.MEDIA_ROOT, "plays")
        if not os.path.exists(plays_dir):
            return

        for filename in os.listdir(plays_dir):
            if filename.startswith(f"{id}"):
                file_path = os.path.join(plays_dir, filename)
                if os.path.isfile(file_path):
                    os.remove(file_path)

    def _handle_image(self, instance, image_file, image_url):

        if image_file:
            ext = image_file.name.split(".")[-1]
            filename = f"{instance.play_id}.{ext}"
            file_path = os.path.join(settings.MEDIA_ROOT, "plays", filename)

            if os.path.exists(file_path):
                os.remove(file_path)

            instance.image.save(filename, image_file, save=True)

        elif image_url == "":
            self._delete_instance_files(instance.play_id)
            instance.image = None
            instance.save()

    def create(self, validated_data):
        actor_ids = validated_data.pop("actor_ids", [])
        director_ids = validated_data.pop("director_ids", [])
        genre_instance = validated_data.pop("genre_id", None)

        image_file = validated_data.pop("image_file", None)
        #!
        validated_data.pop("image_url", None)

        play = Play.objects.create(genre=genre_instance, **validated_data)
        play.actors.set(actor_ids)
        play.directors.set(director_ids)

        #! WARNING я додала це на основі save але треба перевірити (сервер неправильно приймав фото)
        if image_file:
            ext = image_file.name.split(".")[-1]
            filename = f"{play.play_id}.{ext}"
            file_path = os.path.join(settings.MEDIA_ROOT, "plays", filename)

            if os.path.exists(file_path):
                os.remove(file_path)
            play.image.save(filename, image_file, save=True)

        return play

    def update(self, instance, validated_data):
        # log(">>SEE MEEE<<")
        actor_ids = validated_data.pop("actor_ids", None)
        director_ids = validated_data.pop("director_ids", None)
        genre_instance = validated_data.pop("genre_id", None)
        image_file = validated_data.pop("image_file", None)
        image_url = validated_data.pop("image_url", None)

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

        self._handle_image(instance, image_file, image_url)

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
