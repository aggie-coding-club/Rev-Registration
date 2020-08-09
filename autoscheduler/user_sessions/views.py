import json
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import JSONParser

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
        courses = json.loads(request.body.decode())
    except (UnicodeError, json.JSONDecodeError):
        return Response(status=400)

    # Attempt to get user's session
    session = request.session
    term = session.get('term')
    if not term:
        return Response('No term set for user', status=500)

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
