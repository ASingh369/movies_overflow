from django.shortcuts import render

# Create your views here.

def index(request):
  return render(request, 'pages/index.html')

def movies(request):
  return render(request, 'pages/movies.html')

def movie(request, movie_id):
  context = {
    'movie_id': movie_id
  }
  return render(request, 'pages/movie.html', context)

def profile(request):
  return render(request, 'pages/profile.html')
