from django.shortcuts import render, redirect
from django.contrib import messages, auth
from django.contrib.auth.models import User
from datetime import datetime

def cregister(request):
    if request.method == 'POST':
        # Get form values
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        password2 = request.POST['password2']

        # Check if passwords match
        if password == password2:
            # Check username
            if User.objects.filter(username=username).exists():
                messages.error(request, 'That username is taken')
            else:
                if User.objects.filter(email=email).exists():
                    messages.error(request, 'That email is being used')
                else:
                    # Looks good
                    user = User.objects.create_user(username=username, password=password, email=email)
                    
                    user.save()
                    messages.success(request, 'You are now registered')
                    user = auth.authenticate(username=username, password=password)
                    if user is not None:
                        auth.login(request, user)
                        return redirect('index')
        else:
            messages.error(request, 'Passwords do not match')

    return redirect('index')


def clogin(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']

        requestedUser = User.objects.get(email=email)

        user = auth.authenticate(username=requestedUser.username, password=password)

        if user is not None:
            auth.login(request, user)
            messages.success(request, 'You are now logged in')
            return redirect('index')
        else:
            messages.error(request, 'Invalid credentials')
            return redirect('index')

    else:
        return redirect('index')

def logout(request):
    if request.method == 'POST':
        auth.logout(request)
        messages.success(request, 'You are now logged out')
    return redirect('index')
