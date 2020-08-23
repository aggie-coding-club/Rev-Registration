from django.urls import path
from user_sessions.views import (
    get_last_term, set_last_term, save_courses, get_saved_courses
)

urlpatterns = [
    path('get_last_term', get_last_term),
    path('set_last_term', set_last_term),
    path('save_courses', save_courses),
    path('get_saved_courses', get_saved_courses),
]
