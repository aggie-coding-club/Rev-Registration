from django.urls import path
from user_sessions.views import(
    get_last_term, set_last_term, save_courses, get_saved_courses, get_full_name,
    get_saved_availabilities, save_availabilities, logout
)

urlpatterns = [
    path('get_last_term', get_last_term),
    path('set_last_term', set_last_term),
    path('get_full_name', get_full_name),
    path('save_courses', save_courses),
    path('get_saved_courses', get_saved_courses),
    path('get_full_name', get_full_name),
    path('get_saved_availabilities', get_saved_availabilities),
    path('save_availabilities', save_availabilities),
    path('logout', logout),
]
