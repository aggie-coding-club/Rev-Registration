from django.urls import path
from scraper.views import (
    RetrieveTermView, RetrieveCourseSearchView, RetrieveCourseView, ListSectionView,
    get_last_updated,
)

urlpatterns = [
    path('course', RetrieveCourseView.as_view()),
    path('sections', ListSectionView.as_view()),
    path('terms', RetrieveTermView.as_view()),
    path('course/search', RetrieveCourseSearchView.as_view()),
    path('get_last_updated', get_last_updated),
]
