from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor
import time
import numpy as np
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
from django.db.models import *

return_style = "records"  # or list


def get_return_style(request):
    return_style = request.query_params.get("return_type", "records")
    if return_style not in ["records", "list"]:
        return_style = "records"
    return return_style


def analitics_for_theater(data):
    import pandas as pd

    df = pd.DataFrame(data["tickets"])
    if df.empty:
        return {"theatre_id": data["theatre_id"], "empty": True}

    df["time"] = df["time"].apply(lambda x: x.hour)
    prices = df["price"].astype(float)

    z = (prices - prices.mean()) / prices.std(ddof=0)

    # prices2 = df["price"].astype(float).values

    # diff_matrix = np.abs(prices2[:, None] - prices2[None, :])
    # avg_pair_diff = float(diff_matrix.mean())

    return {
        "theatre_id": data["theatre_id"],
        "tickets": int(len(df)),
        "avg_price": float(prices.mean()),
        "median_price": float(prices.median()),
        "p90_price": float(prices.quantile(0.9)),
        "price_cv": float(prices.std() / prices.mean()),  # варіативність
        "outliers": int((z.abs() > 3).sum()),  # дорогі/дешеві
        "peak_hour": int(df["time"].value_counts().idxmax()),
        # "avg_pair_diff": avg_pair_diff,
    }


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
        serializer = PlayLikeToggleSerializer(data={}, context={"request": request, "view": self})

        serializer.is_valid(raise_exception=True)
        result = serializer.save()

        return Response(result, status=status.HTTP_200_OK)

    @action(detail=False, methods=["get"], url_path="stats")
    def stats_1(self, request):
        return_style = get_return_style(request)

        qs = self.repository.stats()
        df = pd.DataFrame(list(qs)).dropna()
        df = df.sort_values(by="likes_amount", ascending=False)
        return Response(df[["likes_amount", "rating"]].to_dict(return_style))

    @action(detail=False, methods=["get"], url_path="stats/2")
    def stats_2(self, request):
        return_style = get_return_style(request)

        qs = self.repository.stats()
        df = pd.DataFrame(list(qs)).dropna()
        df = df.sort_values(by="rating", ascending=False)
        return Response(df[["name", "rating"]].to_dict(return_style))

    @action(detail=True, methods=["post"])
    def rate(self, request, pk=None):
        serializer = PlayRatingSerializer(data=request.data, context={"request": request, "view": self, "play_id": pk})
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
    
    @action(detail=False, methods=["get"], url_path="stats/by/play")
    def stats_genre(self, request):
        return_style = get_return_style(request)

        qs = self.repository.stats_by_play()
        df = pd.DataFrame(list(qs)).dropna()
        return Response(df[["name", "plays_amount"]].to_dict(return_style))


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
    def stats_genre(self, request):
        return_style = get_return_style(request)

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

    @action(detail=False, methods=["get"], url_path="stats/rating/2")
    def stats_rating(self, request):
        return_style = get_return_style(request)

        qs = self.repository.rating()
        df = pd.DataFrame.from_records(qs.values()).dropna().sort_values(by=["rating"], ascending=False)

        df["rating"] = df["rating"].round(1)
        return Response(df[["name", "rating"]].to_dict(return_style))
    
    @action(detail=False, methods=["get"], url_path="stats/daily")
    def stats_daily(self, request):
        return_style = get_return_style(request)

        qs = self.repository.daily_tickets()
        df = pd.DataFrame.from_records(qs).dropna().sort_values(by=["name"], ascending=False).head(15)

        return Response(df.to_dict(return_style))

    #############################################################################################################
    #############################################################################################################
    ##############################не хвилюйтеся, це тимчасова стіна від мого тестового коду######################
    #############################################################################################################
    #############################################################################################################

    def count_tickets_for_theatre(self, theatre_id):
        query_set = (
            Ticket.objects.filter(schedule__hall__theatre_id=theatre_id)
            .annotate(time=F("schedule__time"))
            .values("price", "time")
        )

        return {"theatre_id": theatre_id, "tickets": list(query_set)}

    #!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! TEST ПОКИ ЩО
    @action(detail=False, methods=["get"], url_path="multithread-test")
    def concurrency_test(self, request):
        THREADS = int(request.query_params.get("threads", 1))

        theatre_ids = list(self.repository.get_all().values_list("theatre_id", flat=True))

        start = time.perf_counter()

        with ThreadPoolExecutor(max_workers=THREADS) as executor1:
            data = list(executor1.map(self.count_tickets_for_theatre, theatre_ids))

        # return Response(data)

        with ProcessPoolExecutor(max_workers=THREADS) as executor2:
            analitics = list(executor2.map(analitics_for_theater, data))

        elapsed = time.perf_counter() - start

        df = pd.DataFrame({"theatre_id": theatre_ids, "tickets_sold": data, "analitics": analitics})

        response = {
            "threads": THREADS,
            "time": round(elapsed, 4),
            "data": df.to_dict("records"),
        }

        return Response(response)

    #############################################################################################################
    #############################################################################################################
    ###############################################кінець стіни##################################################
    #############################################################################################################
    #############################################################################################################


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
    def stats_month(self, request):
        return_style = get_return_style(request)

        qs = self.repository.sold_by_month()
        df = pd.DataFrame(list(qs)).sort_values(by="month", ascending=True)
        return Response(df[["date", "amount"]].to_dict(return_style))

    @action(detail=False, methods=["get"], url_path="stats/by/date")
    def stats_date(self, request):
        return_style = get_return_style(request)

        qs = self.repository.stats_by_date()
        df = pd.DataFrame(list(qs)).sort_values(by="date", ascending=True)
        return Response(df[["date", "amount"]].to_dict(return_style))


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
