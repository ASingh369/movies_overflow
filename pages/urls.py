from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('profile/<int:user_id>', views.profile, name='profile'),
    path('movies', views.movies, name='movies'),
    path('movie/<int:movie_id>', views.movie, name='movie'),
    path('grade_movie', views.grade_movie, name='grade_movie'),
    path('add_to_top10', views.add_to_top10, name='add_to_top10'),
    path('get_top10_movies/<int:user_id>', views.get_top10_movies, name='get_top10_movies'),
]