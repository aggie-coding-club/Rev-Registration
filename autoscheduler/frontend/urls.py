from django.urls import path, re_path

from . import views

urlpatterns = [
    # match the root
    path('', views.index),
    # match all other pages
    re_path(r'^(?:.*)/?$', views.index),
]