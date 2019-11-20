from django.shortcuts import render

# Create your views here.
def index(request):
    """ Renders index.html for React. Shouldn't need to be any other logic in here """
    return render(request, 'index.html') # Automatically assumes index is in templates/
