from django.db import models

class FeedbackFormResponse(models.Model):
    """ Represents a submitted response to the feedback form """
    submitted = models.DateTimeField(auto_now_add=True)
    rating = models.IntegerField()
    comment = models.TextField()

    class Meta:
        db_table = "feedback_form_responses"
