from django.urls import path
from scraper.views import RetrieveCourseView, ListSectionView

urlpatterns = [
    path('course', RetrieveCourseView.as_view()),
    path('sections', ListSectionView.as_view())
]
