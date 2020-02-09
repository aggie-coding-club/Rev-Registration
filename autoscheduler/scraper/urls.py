from django.urls import path
from scraper.views import RetrieveCourseView
from scraper.views import RetrieveSectionView

urlpatterns = [
    path('course', RetrieveCourseView.as_view()),
    path('sections', RetrieveSectionView.as_view())
]
