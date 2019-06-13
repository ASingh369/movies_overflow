from django.shortcuts import render

# Create your views here.

def index(request):
  return render(request, 'pages/index.html')
  
def movies(request):
  return render(request, 'pages/movies.html')

def movie(request):
  return render(request, 'pages/movie.html')

def profile(request):
  return render(request, 'pages/profile.html')
