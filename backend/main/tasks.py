import time
from celery import shared_task

@shared_task(bind=True)
def test_task(self, x, y):
    time.sleep(5)   
    return {
        "result": x + y,
        "task_id": self.request.id
    }
    # 🥦🥦🥦🥦🥦🥦🥦🥦🥦🥦🥦🥦🥦🥦