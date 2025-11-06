from abc import ABC


class BaseRepository(ABC):
    def __init__(self, model):
        self.model = model

    def get_all(self):
        return list(self.model.objects.all())

    def get_by_id(self, _id):
        try:
            return self.model.objects.get(pk=_id)
        except Exception:
            return None

    def create(self, **kwargs):
        try:
            e = self.model(**kwargs)
            e.save()
            return e
        except Exception:
            return None

    def update(self, _id, **kwargs):
        m = self.model.objects.filter(pk=_id).first()
        if m:
            for field, value in kwargs.items():
                setattr(m, field, value)
            m.save()
        return m

    def delete(self, _id):
        m = self.model.objects.filter(pk=_id).first()
        if m:
            m.delete()
        return m