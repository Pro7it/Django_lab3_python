from .GenreRepository import *
from .ActorRepository import ActorRepository
from .DirectorRepository import DirectorRepository
from .TicketRepository import TicketRepository
from .TheatreRepository import TheatreRepository
from .ScheduleRepository import ScheduleRepository
from .PlayDirectorRepository import PlayDirectorRepository
from .PlayActorRepository import PlayActorRepository
from .PlayRepository import PlayRepository
from .GenreRepository import GenreRepository
from .HallRepository import HallRepository
from .UserRepository import UserRepository


class Repository:
    def __init__(self):
        self.actors = ActorRepository()
        self.directors = DirectorRepository()
        self.tickets = TicketRepository()
        self.theaters = TheatreRepository()
        self.schedules = ScheduleRepository()
        self.play_directors = PlayDirectorRepository()
        self.play_actors = PlayActorRepository()
        self.plays = PlayRepository()
        self.genres = GenreRepository()
        self.halls = HallRepository()
        self.users = UserRepository()
