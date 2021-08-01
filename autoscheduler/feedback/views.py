from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from feedback.models import FeedbackFormResponse

@api_view(['POST'])
@parser_classes([JSONParser])
def submit_feedback(request):
    """ Creates a FeedbackFormResponse object corresponding to the sent data """
    rating = request.data.get('rating')
    comment = request.data.get('comment')

    # Error 400 if feedback data is invalid
    if not rating or len(comment) > 2000:
        return Response(status=400)

    FeedbackFormResponse(rating=rating, comment=comment).save()
    return Response()
