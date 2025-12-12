import pandas as pd
from main.filter import PlayFilter
from .repository.Repository import Repository
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import *
from drf_yasg.utils import swagger_auto_schema
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend

return_style = "list" # or records


class DefaultPagination(PageNumberPagination):
    # page_size = 10
    page_size_query_param = "limit"


class BaseViewSet(viewsets.GenericViewSet):
    repository = None
    serializer_class = None
    permission_classes = [AllowAny]

    def list(self, _):
        objs = self.repository.get_all()
        serializer = self.serializer_class(objs, many=True)
        return Response(serializer.data)

    def retrieve(self, _, pk=None):
        obj = self.repository.get_by_id(pk)
        if obj is None:
            return Response(f"there is no object with id = {pk}", status=404)
        serializer = self.serializer_class(obj)
        return Response(serializer.data)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            obj = serializer.save()
            response_serializer = self.serializer_class(obj)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        instance = self.repository.get_by_id(pk)
        if instance is None:
            return Response({"detail": f"Object with id={pk} not found"}, status=404)

        serializer = self.serializer_class(instance, data=request.data, partial=False)
        if serializer.is_valid():
            instance = serializer.save()
            response_serializer = self.serializer_class(instance)
            return Response(response_serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, _, pk=None):
        self.repository.delete(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)


class PlayViewSet(BaseViewSet):
    repository = Repository().plays
    serializer_class = PlaySerializer
    pagination_class = DefaultPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = PlayFilter
    queryset = Play.objects.all()

    def get_serializer_context(self):
        return {"request": self.request}

    @swagger_auto_schema(request_body=serializer_class)
    def create(self, request):
        return super().create(request)

    @swagger_auto_schema(request_body=serializer_class)
    def update(self, request, pk=None):
        return super().update(request, pk)

    def list(self, request):
        objs = self.repository.get_all()
        queryset = self.filter_queryset(objs)

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request)
        serializer = self.serializer_class(page, many=True)
        return paginator.get_paginated_response(serializer.data)
    
    def retrieve(self, request, pk=None):
        obj = self.repository.get_by_id(pk)
        if obj is None:
            return Response(f"there is no object with id = {pk}", status=404)

        serializer = self.get_serializer(obj)
        return Response(serializer.data)

    
    @action(detail=True, methods=["post"])
    def like(self, request, pk=None):
        serializer = PlayLikeToggleSerializer(
            data={},
            context={"request": request, "view": self}
        )

        serializer.is_valid(raise_exception=True)
        result = serializer.save()

        return Response(result, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path="stats")
    def stats_actors(self, _):
        qs = self.repository.stats()
        return Response(pd.DataFrame(list(qs)).fillna(0).to_dict(return_style))
    
    @action(detail=True, methods=["post"])
    def rate(self, request, pk=None):
        serializer = PlayRatingSerializer(
            data=request.data,
            context={"request": request, "view": self, "play_id": pk}
        )
        serializer.is_valid(raise_exception=True)
        result = serializer.save()
        return Response(result, status=status.HTTP_200_OK)


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

    @action(detail=False, methods=["get"], url_path="stats/by/name")
    def stats_genre(self, _):
        qs = self.repository.stats()
        return Response(pd.DataFrame(list(qs)).fillna(0).to_dict(return_style))


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

    @action(detail=False, methods=["get"], url_path="stats")
    def stats(self, _):
        report = self.repository.get_stats()
        return Response(report)


class TheatreViewSet(BaseViewSet):
    repository = Repository().theaters
    serializer_class = TheatreSerializer

    @swagger_auto_schema(request_body=serializer_class)
    def create(self, request):
        return super().create(request)

    @swagger_auto_schema(request_body=serializer_class)
    def update(self, request, pk=None):
        return super().update(request, pk)

    @action(detail=False, methods=["get"], url_path="stats/rating")
    def stats_rating(self, _):
        qs = self.repository.rating()
        df = pd.DataFrame.from_records(qs.values()).dropna().sort_values(by=["rating"], ascending=False)

        df["rating"] = df["rating"].round(1)
        return Response(df.to_dict("records"))
    
    @action(detail=False, methods=["get"], url_path="stats/rating/2")
    def stats_rating(self, _):
        qs = self.repository.rating()
        df = pd.DataFrame.from_records(qs.values()).dropna().sort_values(by=["rating"], ascending=False)

        df["rating"] = df["rating"].round(1)
        return Response(df[["theatre_id", "rating"]].to_dict(return_style))


class TicketViewSet(BaseViewSet):
    repository = Repository().tickets
    serializer_class = TicketSerializer

    @swagger_auto_schema(request_body=serializer_class)
    def create(self, request):
        return super().create(request)

    @swagger_auto_schema(request_body=serializer_class)
    def update(self, request, pk=None):
        return super().update(request, pk)

    @action(detail=False, methods=["get"], url_path="stats/by/month")
    def stats_month(self, _):
        qs = self.repository.sold_by_month()
        df = pd.DataFrame(list(qs)).sort_values(by="month", ascending=True)
        return Response(df.to_dict(return_style))
    
    @action(detail=False, methods=["get"], url_path="stats/by/date")
    def stats_date(self, _):
        qs = self.repository.stats_by_date()
        df = pd.DataFrame(list(qs)).sort_values(by="date", ascending=True)
        return Response(df.to_dict(return_style))


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
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            # obj = serializer.save()
            obj = self.repository.create(**validated_data)
            if obj is None:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            response_serializer = self.serializer_class(obj)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(request_body=serializer_class)
    def update(self, request, pk=None):
        self.get_serializer_class()
        instance = self.repository.get_by_id(pk)
        if instance is None:
            return Response(f"there is no object with id = {pk}", status=404)

        serializer = self.serializer_class(instance, data=request.data, partial=False)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            # instance = serializer.save()
            instance = self.repository.update(instance, **validated_data)
            response_serializer = self.serializer_class(instance)
            return Response(response_serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
