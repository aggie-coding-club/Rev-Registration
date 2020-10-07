import json
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import JSONParser
from django.contrib.auth.models import User
from django.contrib import auth

@api_view(['GET'])
def get_last_term(request):
    """ API endpoint that returns JSON containing last term for the user's session. """
    term = request.session.get('term')
    response = {}
    if term:
        response['term'] = term
    return Response(response)

@api_view(['PUT'])
def set_last_term(request):
    """ API endpoint that sets term for the current session. Called when a term is
        selected, or when the title bar is clicked to unset last term.
    """
    term = request.query_params.get('term')
    # empty string term is valid (used to unset term), so explicitly check for None
    if term is None:
        return Response(status=400)
    request.session['term'] = term
    return Response()

@api_view(['PUT'])
@parser_classes([JSONParser])
def save_courses(request):
    """ API endpoint that saves course cards for user's current term. Note that this
        doesn't check the formatting, it assumes the frontend can deal with it when
        it's retrieved later
    """
    try:
        body = json.loads(request.body.decode())
        courses = body.get('courses', {})
        term = body.get('term')
        if not term:
            return Response('Request body must contain courses and term', status=400)
    except (UnicodeError, json.JSONDecodeError):
        return Response(status=400)

    # Attempt to get user's session
    session = request.session

    term_data = session.setdefault(term, {})
    term_data['courses'] = courses
    session.modified = True

    return Response()

@api_view(['GET'])
def get_saved_courses(request):
    """ API endpoint that retrieves saved courses for the requested term. """
    term = request.query_params.get('term')
    if not term:
        return Response(status=400)

    session = request.session
    response = []
    if term:
        courses = session.get(term, {}).get('courses')
        if courses:
            response = courses
    return Response(response)

@api_view(['GET'])
def get_full_name(request):
    """ View that retrieves the first and last name separated by a space for the user
          of the current session
    """
    user_id = request.session.get('_auth_user_id')
    if user_id is None:
        return Response(status=400)
    user = User.objects.get(pk=user_id)
    response = {'fullName': user.get_full_name()}
    return Response(response)

@api_view(['POST'])
#TODO MAKE LOADING TEST
def logout(request):
    """ Logs out the user and redirects to index"""
    auth.logout(request)
    return Response()
