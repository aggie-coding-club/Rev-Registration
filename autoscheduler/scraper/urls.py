from django.urls import path
from scraper.views import RetrieveCourseView
from scraper.views import ListSectionView
from scraper.views import RetrieveTermView
from scraper.views import RetrieveCourseSearchView

urlpatterns = [
    path('course', RetrieveCourseView.as_view()),
    path('sections', ListSectionView.as_view()),
    path('terms', RetrieveTermView.as_view()),
    path('course/search', RetrieveCourseSearchView.as_view())
]
