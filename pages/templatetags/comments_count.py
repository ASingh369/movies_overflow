from django import template
from pages.models import Comment

register = template.Library()

@register.filter
def comments_count(obj):
    return obj.comments_count()