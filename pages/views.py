from django.shortcuts import render, redirect
from .models import Grade, Top10
from django.contrib import messages, auth

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

def profile(request):
  return render(request, 'pages/profile.html')
