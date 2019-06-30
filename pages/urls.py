from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('add_post', views.add_post, name='add_post'),
    path('add_comment', views.add_comment, name='add_comment'),
    path('get_comments/<int:post_id>', views.get_comments, name='get_comments'),
    path('profile/<int:user_id>', views.profile, name='profile'),
    path('follow_user', views.follow_user, name='follow_user'),
    path('movies', views.movies, name='movies'),
    path('movie/<int:movie_id>', views.movie, name='movie'),
    path('grade_movie', views.grade_movie, name='grade_movie'),
    path('add_to_top10', views.add_to_top10, name='add_to_top10'),
    path('delete_from_top10/<int:user_id>/<int:rank>', views.delete_from_top10, name='delete_from_top10'),
    path('move_up_top10/<int:user_id>/<int:rank>', views.move_up_top10, name='move_up_top10'),
    path('move_down_top10/<int:user_id>/<int:rank>', views.move_down_top10, name='move_down_top10'),
    path('get_top10_movies/<int:user_id>', views.get_top10_movies, name='get_top10_movies'),
    path('get_graded_movies/<int:user_id>/<int:grade>', views.get_graded_movies, name='get_graded_movies'),
    path('get_all_graded_movies/<int:user_id>', views.get_all_graded_movies, name='get_all_graded_movies'),
]