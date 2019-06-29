from django.contrib import admin
from .models import Grade, Top10, Follow, Post

class GradeAdmin(admin.ModelAdmin):
    list_display = ('user', 'movie_id', 'grade', 'grade_time')
    list_display_links = ('user', 'movie_id')
    list_per_page = 50

class Top10Admin(admin.ModelAdmin):
    list_display = ('user', 'movie_id', 'rank', 'time')
    list_display_links = ('user', 'movie_id')
    list_per_page = 50

class FollowAdmin(admin.ModelAdmin):
    list_display = ('user', 'follower', 'time')
    list_display_links = ('user', 'follower')
    list_per_page = 50

class PostAdmin(admin.ModelAdmin):
    list_display = ('user', 'text', 'time', 'upvotes')
    list_display_links = ('user', 'text')
    list_per_page = 50


admin.site.register(Grade, GradeAdmin)
admin.site.register(Top10, Top10Admin)
admin.site.register(Follow, FollowAdmin)
admin.site.register(Post, PostAdmin)
