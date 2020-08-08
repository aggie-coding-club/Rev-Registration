from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.models import User

@api_view(['GET'])
def get_last_term(request):
    """ View that returns JSON containing last term for the current user's session.
        Used by landing page to determine whether to redirect to schedules. """
    term = request.session.setdefault('term', '')
    response = {'term': term}
    return Response(response)

@api_view(['PUT'])
def set_last_term(request):
    """ View that sets term for the current session. Called when a term is selected,
        or when the title bar is clicked to unset last term.
    """
    term = request.query_params.get('term')
    # empty string term is valid (used to unset term), so explicitly check for None
    if term is None:
        return Response(status=400)
    request.session['term'] = term
    return Response()

@api_view(['GET'])
def get_full_name(request):
    """ View that retrieves the first and last name seperated by a space for the user
    of the current session """
    user_id = request.session.get('_auth_user_id')
    if user_id is None:
        return Response(status=400)
    user = User.objects.get(pk=user_id)
    response = {'fullName': user.get_full_name()}
    return Response(response)
