from .BaseRepository import BaseRepository
from main.models import *
from django.db.models import *
from django.db.models.functions import *


class TicketRepository(BaseRepository):
    def __init__(self):
        super().__init__(Ticket)

    def sold_by_month(self):

        qs = (
            self.model.objects.annotate(month=ExtractDay("schedule__date"))
            .values("month")
            .annotate(amount=Count("ticket_id"))
            .values("month", "amount")
        )

        return qs

    def stats_by_date(self):

        qs = self.model.objects.values(date=F("schedule__date")).annotate(
            avg_price=Avg("price"), amount=Count("ticket_id")
        )

        return qs
    
    def stats(self):
        return self.model.objects.values_list("price", flat=True)
    
    def sold_by_price(self):
        return (
            Ticket.objects.filter(status="проданий")
            .values(
                ticket_price=Cast("price", IntegerField())
            )
            .annotate(
                total_sold=Count("ticket_id")
            )
            .order_by("ticket_price")
        )

