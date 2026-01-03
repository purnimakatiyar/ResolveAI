from celery import Celery

celery_app = Celery(
    "resolveai",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0",
)

celery_app.conf.task_routes = {
    "app.workers.ai_tasks.*": {"queue": "ai"},
}
