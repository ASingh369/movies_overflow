from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

class Grade(models.Model):
  user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
  movie_id = models.IntegerField(default=0)
  grade = models.IntegerField(default=0)
  grade_time = models.DateTimeField(default=datetime.now, blank=True)

class Top10(models.Model):
  user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
  movie_id = models.IntegerField(default=0)
  rank = models.IntegerField(default=0)
  time = models.DateTimeField(default=datetime.now, blank=True)

class Follow(models.Model):
  user = models.ForeignKey(User, related_name="user", on_delete=models.DO_NOTHING)  
  follower = models.ForeignKey(User, related_name="follower", on_delete=models.DO_NOTHING) 
  time = models.DateTimeField(default=datetime.now, blank=True)

class Post(models.Model):
  user = models.ForeignKey(User, on_delete=models.DO_NOTHING)  
  time = models.DateTimeField(default=datetime.now, blank=True)
  text = models.TextField()
  votes = models.IntegerField(default=0)
  movie_bg = models.CharField(max_length=500, default="0")
  
  def comments_count(self):
    return Comment.objects.filter(post=self).count()

class Comment(models.Model):
  comment = models.TextField()
  post = models.ForeignKey(Post, on_delete=models.DO_NOTHING)
  user = models.ForeignKey(User, on_delete=models.DO_NOTHING)  
  time = models.DateTimeField(default=datetime.now, blank=True)

  