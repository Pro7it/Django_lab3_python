from django.http import HttpResponse
from .repository.Repository import Repository
from rest_framework import viewsets, status
from rest_framework.response import Response
from .serializers import *

# Create your views here.

class BaseViewSet(viewsets.ViewSet):
    repository = None
    serializer_class = None

    def list(self, request):
        objs = self.repository.get_all()
        serializer = self.serializer_class(objs, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        obj = self.repository.get_by_id(pk)
        serializer = self.serializer_class(obj)
        return Response(serializer.data)

    def create(self, request):
        obj = self.repository.create(request.data)
        serializer = self.serializer_class(obj)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, pk=None):
        obj = self.repository.update(pk, request.data)
        serializer = self.serializer_class(obj)
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        self.repository.delete(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)

class PlayViewSet(BaseViewSet):
    repository = Repository().plays
    serializer_class = PlaySerializer

class ActorViewSet(BaseViewSet):
    repository = Repository().actors
    serializer_class = ActorSerializer

class DirectorViewSet(BaseViewSet):
    repository = Repository().directors
    serializer_class = DirectorSerializer

class GenreViewSet(BaseViewSet):
    repository = Repository().genres
    serializer_class = GenreSerializer

class HallViewSet(BaseViewSet):
    repository = Repository().halls
    serializer_class = HallSerializer

class ScheduleViewSet(BaseViewSet):
    repository = Repository().schedules
    serializer_class = ScheduleSerializer

class TheatreViewSet(BaseViewSet):
    repository = Repository().theaters
    serializer_class = TheatreSerializer

class TicketViewSet(BaseViewSet):
    repository = Repository().tickets
    serializer_class = TicketSerializer