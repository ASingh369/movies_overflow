from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.models import User
from .models import Grade, Top10, Follow
from django.contrib import messages, auth
from django.http import JsonResponse

def index(request):
  return render(request, 'pages/index.html')

def movies(request):
  return render(request, 'pages/movies.html')

def movie(request, movie_id):
  grade = ""
  grades = Grade.objects.filter(user=request.user, movie_id=movie_id)
  if grades:
    grade = Grade.objects.get(user=request.user, movie_id=movie_id).grade

  context = {
    'movie_id': movie_id,
    'grade': grade
  }
  return render(request, 'pages/movie.html', context)

def grade_movie(request):
  if request.user.is_authenticated:
    if request.method == 'POST':
      movie_id = request.POST['movie_id']
      grade = request.POST['grade']

      existingGrades = Grade.objects.filter(user=request.user, movie_id=movie_id)
      if (existingGrades):
        existingGrade = Grade.objects.get(user=request.user, movie_id=movie_id)
        existingGrade.grade = grade
        existingGrade.save()
        messages.success(request, 'Movie Grade Updated')
      else:
        newGrade = Grade(user=request.user, movie_id=movie_id, grade=grade)
        newGrade.save()
        messages.success(request, 'Movie Graded')
  else:
    messages.error(request, 'You need to be logged in to grade a movie')

  return redirect('movie', movie_id)

def add_to_top10(request):
  if request.method == 'POST':
      movie_id = request.POST['movie_id']

      current_top_count = Top10.objects.filter(user=request.user).count()

      movie_already_exists = Top10.objects.filter(user=request.user, movie_id=movie_id)

      if not movie_already_exists:
        if current_top_count == 0:
          # Create new user list
          new_top10 = Top10(user=request.user, movie_id=movie_id, rank=1)
          new_top10.save()
          messages.success(request, 'created new list')
        elif current_top_count < 10:
          # add to list
          new_top10 = Top10(user=request.user, movie_id=movie_id, rank=current_top_count+1)
          new_top10.save()
          messages.success(request, 'new movie added to list')
        else:
          # edit last movie
          current_last_movie = Top10.objects.get(user=request.user, rank=10)
          current_last_movie.movie_id = movie_id

          current_last_movie.save()
          messages.success(request, 'last movie changed')

          
          print(current_top_count)
      else:
        # movie already in your top 10 list
        messages.success(request, 'Movie already exists in your top 10 list')
  return redirect('movie', movie_id)

def get_top10_movies(request, user_id):
  """
    returns Json response of user's top 10 movies
  """

  data = list(Top10.objects.filter(user__id=user_id).values())
  return JsonResponse(data, safe=False)

def delete_from_top10(request, rank, user_id):
  """
    delete movie from top 10 movies list
  """
  # Delete current rank and change higher ranks
  Top10.objects.get(user__id=user_id, rank=rank).delete()

  current_list = Top10.objects.filter(user__id=user_id, rank__gt=rank)
  for item in current_list:
    item.rank = item.rank - 1
    item.save()

  data = list(Top10.objects.filter(user__id=user_id).values())
  return JsonResponse(data, safe=False)

def move_up_top10(request, rank, user_id):
  """
    Improve user rank of given movie
  """
  if rank > 1:
    lower = Top10.objects.get(user__id=user_id, rank=rank)
    upper = Top10.objects.get(user__id=user_id, rank=rank-1)
    lower.rank = lower.rank-1
    upper.rank = upper.rank+1
    lower.save()
    upper.save()


  data = list(Top10.objects.filter(user__id=user_id).values())
  return JsonResponse(data, safe=False)

def move_down_top10(request, rank, user_id):
  """
    Improve user rank of given movie
  """
  total_movies = Top10.objects.filter(user__id=user_id).count()
  if rank < total_movies:
    lower = Top10.objects.get(user__id=user_id, rank=rank+1)
    upper = Top10.objects.get(user__id=user_id, rank=rank)
    lower.rank = lower.rank-1
    upper.rank = upper.rank+1
    lower.save()
    upper.save()

  data = list(Top10.objects.filter(user__id=user_id).values())
  return JsonResponse(data, safe=False)

def profile(request, user_id):

  profile_user = get_object_or_404(User, id=user_id)

  followers = Follow.objects.filter(user=profile_user).count()
  following = Follow.objects.filter(follower=profile_user).count()
  movies_graded = Grade.objects.filter(user=profile_user).count()

  top10_movies = Top10.objects.filter(user=profile_user)

  context = {
    'profile_user': profile_user,
    'followers': followers,
    'following': following,
    'movies_graded': movies_graded,
    'top10_movies': top10_movies
  }
  return render(request, 'pages/profile.html', context)
