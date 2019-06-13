from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('profile', views.profile, name='profile'),
    path('movies', views.movies, name='movies'),
    path('movies/movie', views.movie, name='movie'),
]