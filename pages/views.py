from django.shortcuts import render, redirect
from .models import Grade
from django.contrib import messages, auth

def index(request):
  return render(request, 'pages/index.html')

def movies(request):
  return render(request, 'pages/movies.html')

def movie(request, movie_id):
  context = {
    'movie_id': movie_id
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

def profile(request):
  return render(request, 'pages/profile.html')
