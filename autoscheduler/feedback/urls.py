from django.urls import path
from feedback.views import submit_feedback

urlpatterns = [
    path('submit', submit_feedback),
]
