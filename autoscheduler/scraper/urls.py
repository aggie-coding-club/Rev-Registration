from django.urls import path
from scraper.views import RetrieveCourseView

urlpatterns = [
    path('course', RetrieveCourseView.as_view()),
]
