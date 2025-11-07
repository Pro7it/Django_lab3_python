from .repository.Repository import Repository
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import *
from drf_yasg.utils import swagger_auto_schema


class BaseViewSet(viewsets.ViewSet):
    repository = None
    serializer_class = None
    permission_classes = [IsAuthenticated]

    def list(self, _):
        objs = self.repository.get_all()
        serializer = self.serializer_class(objs, many=True)
        return Response(serializer.data)

    def retrieve(self, _, pk=None):
        obj = self.repository.get_by_id(pk)
        serializer = self.serializer_class(obj)
        return Response(serializer.data)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            obj = self.repository.create(**validated_data)
            print(validated_data)
            if obj is None:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            response_serializer = self.serializer_class(obj)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        instance = self.repository.get_by_id(pk)
        if instance is None:
            return None

        serializer = self.serializer_class(instance, data=request.data, partial=False)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            instance = self.repository.update(instance, **validated_data)
            response_serializer = self.serializer_class(instance)
            return Response(response_serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, _, pk=None):
        self.repository.delete(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)


class PlayViewSet(BaseViewSet):
    repository = Repository().plays
    serializer_class = PlaySerializer

    @swagger_auto_schema(request_body=serializer_class)
    def create(self, request):
        return super().create(request)

    @swagger_auto_schema(request_body=serializer_class)
    def update(self, request, pk=None):
        return super().update(request, pk)


class ActorViewSet(BaseViewSet):
    repository = Repository().actors
    serializer_class = ActorSerializer

    @swagger_auto_schema(request_body=serializer_class)
    def create(self, request):
        return super().create(request)

    @swagger_auto_schema(request_body=serializer_class)
    def update(self, request, pk=None):
        return super().update(request, pk)


class DirectorViewSet(BaseViewSet):
    repository = Repository().directors
    serializer_class = DirectorSerializer

    @swagger_auto_schema(request_body=serializer_class)
    def create(self, request):
        return super().create(request)

    @swagger_auto_schema(request_body=serializer_class)
    def update(self, request, pk=None):
        return super().update(request, pk)


class GenreViewSet(BaseViewSet):
    repository = Repository().genres
    serializer_class = GenreSerializer

    @swagger_auto_schema(request_body=serializer_class)
    def create(self, request):
        return super().create(request)

    @swagger_auto_schema(request_body=serializer_class)
    def update(self, request, pk=None):
        return super().update(request, pk)


class HallViewSet(BaseViewSet):
    repository = Repository().halls
    serializer_class = HallSerializer

    @swagger_auto_schema(request_body=serializer_class)
    def create(self, request):
        return super().create(request)

    @swagger_auto_schema(request_body=serializer_class)
    def update(self, request, pk=None):
        return super().update(request, pk)


class ScheduleViewSet(BaseViewSet):
    repository = Repository().schedules
    serializer_class = ScheduleSerializer

    @swagger_auto_schema(request_body=serializer_class)
    def create(self, request):
        return super().create(request)

    @swagger_auto_schema(request_body=serializer_class)
    def update(self, request, pk=None):
        return super().update(request, pk)


class TheatreViewSet(BaseViewSet):
    repository = Repository().theaters
    serializer_class = TheatreSerializer

    @swagger_auto_schema(request_body=serializer_class)
    def create(self, request):
        return super().create(request)

    @swagger_auto_schema(request_body=serializer_class)
    def update(self, request, pk=None):
        return super().update(request, pk)


class TicketViewSet(BaseViewSet):
    repository = Repository().tickets
    serializer_class = TicketSerializer

    @swagger_auto_schema(request_body=serializer_class)
    def create(self, request):
        return super().create(request)

    @swagger_auto_schema(request_body=serializer_class)
    def update(self, request, pk=None):
        return super().update(request, pk)


class UserViewSet(BaseViewSet):
    permission_classes = []
    repository = Repository().users
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == "create":
            self.serializer_class = UserCreateSerializer
            return UserCreateSerializer
        self.serializer_class = UserSerializer
        return self.serializer_class

    @swagger_auto_schema(request_body=serializer_class)
    def create(self, request):
        self.get_serializer_class()
        return super().create(request)

    @swagger_auto_schema(request_body=serializer_class)
    def update(self, request, pk=None):
        self.get_serializer_class()
        return super().update(request, pk)
