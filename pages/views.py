from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.models import User
from .models import Grade, Top10, Follow, Post, Comment
from django.contrib import messages, auth
from django.http import JsonResponse
from datetime import date, timedelta

def index(request):
  posts = Post.objects.filter()
  if request.method == 'GET':
    try:
      results = request.GET['results']
    except:
      results = ""
    if results == 'latest':
      posts = Post.objects.filter().order_by('-time')
    elif results == 'top_w':
      d=date.today()-timedelta(days=7)
      posts = Post.objects.filter(time__gte=d).order_by('-votes')
    elif results == 'top_m':
      d=date.today()-timedelta(days=30)
      posts = Post.objects.filter(time__gte=d).order_by('-votes')
    elif results == 'top_all':
      d=date.today()-timedelta(days=365)
      posts = Post.objects.filter(time__gte=d).order_by('-votes')

  suggested = User.objects.filter()

  context = {
    'posts': posts,
    'suggested': suggested,
  }
  return render(request, 'pages/index.html', context)

def movies(request):
  return render(request, 'pages/movies.html')

def movie(request, movie_id):
  grade = ""
  if request.user.is_authenticated:
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
    movie_id = request.POST['movie_id']

  return redirect('movie', movie_id)

def add_to_top10(request):
  if request.user.is_authenticated:
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
  else:
    if request.method == 'POST':
        movie_id = request.POST['movie_id']
        messages.error(request, 'You are not logged in')
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

def get_graded_movies(request, user_id, grade):
  """
    Get user's list of graded movies of given grade
  """
  data = list(Grade.objects.filter(user__id=user_id, grade=grade).values())
  return JsonResponse(data, safe=False)

def get_all_graded_movies(request, user_id):
  """
    Get list of all movies graded by user
  """
  data = list(Grade.objects.filter(user__id=user_id).values())
  return JsonResponse(data, safe=False)

def profile(request, user_id):

  profile_user = get_object_or_404(User, id=user_id)
  already_follows = False

  followers = Follow.objects.filter(user=profile_user).count()
  following = Follow.objects.filter(follower=profile_user).count()
  movies_graded = Grade.objects.filter(user=profile_user).count()

  top10_movies = Top10.objects.filter(user=profile_user)

  if profile_user == request.user or Follow.objects.filter(user=profile_user, follower=request.user):
    already_follows = True

  context = {
    'profile_user': profile_user,
    'followers': followers,
    'following': following,
    'movies_graded': movies_graded,
    'top10_movies': top10_movies,
    'already_follows': already_follows
  }
  return render(request, 'pages/profile.html', context)


def follow_user(request):
  if request.method == "POST":
    profile_id = request.POST["profile_id"]
    profile_user = User.objects.get(id=profile_id)
    follow = Follow(user=profile_user, follower=request.user)
    follow.save()
    messages.success(request, 'User followed successfully')

  return redirect('profile', profile_id)

def add_post(request):
  if request.method == "POST":
    text = request.POST['post-text']
    movie_bg = request.POST['movie-id']
    if movie_bg == '':
      movie_bg = "0"
    post = Post(user=request.user, text=text, movie_bg=movie_bg)
    post.save()
    messages.success(request, 'Post added')
  
  return redirect('index')

def add_comment(request):
  if request.method == "POST":
    comment = request.POST['comment']
    post_id = request.POST['post_id']
    post = Post.objects.get(id=post_id)
    comment = Comment(post=post, comment=comment, user=request.user)
    comment.save()
    messages.success(request, 'Comment added')
  return redirect('index')

def get_comments(request, post_id):
  comments = Comment.objects.filter(post__id=post_id).values('user__username', 'comment', 'time')
  print(comments)

  data = list(Comment.objects.filter(post__id=post_id).values('user__username', 'comment', 'time'))
  return JsonResponse(data, safe=False)
  
def no_log_in(request):
  messages.error(request, "You need to be logged in to view this page")
  return redirect("index")