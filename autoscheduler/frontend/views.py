from django.conf import settings
from django.shortcuts import render

_INDEX_CONTEXT = {
    'IS_GCP': settings.IS_GCP,
}

# Create your views here.
def index(request):
    """ Renders index.html for React. Shouldn't need to be any other logic in here """
    # Automatically assumes index is in templates/
    return render(request, 'index.html', context=_INDEX_CONTEXT)
