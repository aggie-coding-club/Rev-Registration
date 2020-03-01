from django.urls import path
from scraper.views import RetrieveTermView
from scraper.views import RetrieveCourseSearchView

urlpatterns = [
    path('terms', RetrieveTermView.as_view()),
    path('course/search', RetrieveCourseSearchView.as_view())
]
