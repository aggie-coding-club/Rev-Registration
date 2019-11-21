from django.urls import re_path

from . import views

urlpatterns = [
    # match literally everything
    re_path(r'.*', views.index),
]