from django.urls import path
from user_sessions.views import (get_last_term, set_last_term, get_full_name,
                                 logout_view, get_is_logged_in)

urlpatterns = [
    path('get_last_term', get_last_term),
    path('set_last_term', set_last_term),
    path('get_full_name', get_full_name),
    path('get_is_logged_in', get_is_logged_in),
    path('logout', logout_view),
]
