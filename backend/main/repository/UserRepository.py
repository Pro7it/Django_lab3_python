from .BaseRepository import BaseRepository
from main.models import *


class UserRepository(BaseRepository):
    def __init__(self):
        super().__init__(User)

    def create(self, **kwargs):
        try:
            password = kwargs.pop("password", None)
            groups = kwargs.pop("groups", [])
            user_permissions = kwargs.pop("user_permissions", [])

            e = User.objects.create_user(**kwargs, password=password)

            e.groups.set(groups)
            e.user_permissions.set(user_permissions)
            return e
        except Exception as exc:
            print("Error:", exc)
            return None

    def update(self, instance, **kwargs):
        password = kwargs.pop("password", None)
        groups = kwargs.pop("groups", None)
        user_permissions = kwargs.pop("user_permissions", None)

        for field, value in kwargs.items():
            setattr(instance, field, value)

        if password:
            instance.set_password(password)  

        if groups is not None:
            instance.groups.set(groups)  
            
        if user_permissions is not None:
            instance.user_permissions.set(user_permissions)  

        instance.save()
        return instance
