from django.contrib import admin
from .models import Grade, Top10

class GradeAdmin(admin.ModelAdmin):
    list_display = ('user', 'movie_id', 'grade', 'grade_time')
    list_display_links = ('user', 'movie_id')
    list_per_page = 50

class Top10Admin(admin.ModelAdmin):
    list_display = ('user', 'movie_id', 'rank', 'time')
    list_display_links = ('user', 'movie_id')
    list_per_page = 50

admin.site.register(Grade, GradeAdmin)
admin.site.register(Top10, Top10Admin)
