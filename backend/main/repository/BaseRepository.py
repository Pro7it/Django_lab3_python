from abc import ABC


class BaseRepository(ABC):
    def __init__(self, model):
        self.model = model

    def get_all(self):
        return self.model.objects.all()

    def get_by_id(self, _id):
        return self.model.objects.filter(pk=_id).first()

    def create(self, **kwargs):
        try:
            e = self.model(**kwargs)
            e.save()
            return e
        except Exception as e:
            print("Error:", e)
            return None

    def update(self, instance, **kwargs):
        for field, value in kwargs.items():
            setattr(instance, field, value)
        instance.save()
        return instance

    def delete(self, _id):
        m = self.model.objects.filter(pk=_id).first()
        if m:
            m.delete()
        return m
