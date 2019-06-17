from django.urls import path

from . import views

urlpatterns = [
    path('cregister', views.cregister, name='cregister'),
    path('clogin', views.clogin, name='clogin'),
]