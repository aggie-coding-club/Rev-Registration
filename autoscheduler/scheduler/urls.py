from django.urls import path
from scheduler.views import ScheduleView

urlpatterns = [
    path('generate', ScheduleView.as_view()),
]
