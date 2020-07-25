from django.urls import path
from user_sessions.views import get_last_term, set_last_term

urlpatterns = [
    path('get_last_term', get_last_term),
    path('set_last_term', set_last_term),
]
