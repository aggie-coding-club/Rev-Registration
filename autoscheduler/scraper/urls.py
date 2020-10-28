from django.urls import path
from scraper.views import (
    RetrieveTermView, RetrieveCourseSearchView, RetrieveCourseView, ListSectionView
)

urlpatterns = [
    path('course', RetrieveCourseView.as_view()),
    path('sections', ListSectionView.as_view()),
    path('terms', RetrieveTermView.as_view()),
    path('course/search', RetrieveCourseSearchView.as_view())
]
