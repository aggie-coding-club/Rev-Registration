import os
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from feedback.models import FeedbackFormResponse
from discord_bot import send_discord_message

DISCORD_CHANNEL_ID = int(os.getenv('DISCORD_FEEDBACK_CHANNEL_ID') or -1)

@api_view(['POST'])
@parser_classes([JSONParser])
def submit_feedback(request):
    """ Creates a FeedbackFormResponse object corresponding to the sent data """
    rating = request.data.get('rating')
    comment = request.data.get('comment')

    # Error 400 if feedback data is invalid
    if (not isinstance(rating, int) or rating < 1 or rating > 5) or len(comment) > 2000:
        return Response(status=400)

    FeedbackFormResponse(rating=rating, comment=comment).save()
    send_discord_message(DISCORD_CHANNEL_ID, f'New rating ({rating}/5):\n\n{comment}')
    return Response()
