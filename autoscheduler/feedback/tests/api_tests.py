from rest_framework.test import APITestCase, APIClient
from feedback.models import FeedbackFormResponse

class APITests(APITestCase):
    """ Tests API functionality """
    def test_submit_feedback_accepts_with_rating_without_comment(self):
        """ Tests that /feedback/submit accepts feedback with a rating but no comment """
        # Arrange
        rating = 5
        comment = ''
        request_body = {'rating': rating, 'comment': comment}

        # Act
        response = self.client.post('/feedback/submit', request_body, format='json')

        # Assert
        self.assertEqual(response.status_code, 200)
        FeedbackFormResponse.objects.get(rating=rating, comment=comment)

    def test_submit_feedback_accepts_with_rating_and_comment(self):
        """ Tests that /feedback/submit accepts feedback with a rating and comment """
        # Arrange
        rating = 1
        comment = 'This site is horrible!!!!!!!!!!!!!!!!!!!!!!!!'
        request_body = {'rating': rating, 'comment': comment}

        # Act
        response = self.client.post('/feedback/submit', request_body, format='json')

        # Assert
        self.assertEqual(response.status_code, 200)
        FeedbackFormResponse.objects.get(rating=rating, comment=comment)

    def test_submit_feedback_rejects_comment_over_2000_characters(self):
        """ Tests that long comments are rejected and not added to the database """
        # Arrange
        rating = 3
        comment = 'W' * 2001
        request_body = {'rating': rating, 'comment': comment}

        # Act
        response = self.client.post('/feedback/submit', request_body, format='json')

        # Assert
        self.assertEqual(response.status_code, 400)
        self.assertEqual(FeedbackFormResponse.objects.all().count(), 0)

    def test_submit_feedback_rejects_with_no_rating(self):
        """ Tests that feedback without a rating is rejected """
        # Arrange
        comment = 'idk'
        request_body = {'comment': comment}

        # Act
        response = self.client.post('/feedback/submit', request_body, format='json')

        # Assert
        self.assertEqual(response.status_code, 400)
        self.assertEqual(FeedbackFormResponse.objects.all().count(), 0)

    def test_submit_feedback_rejects_with_rating_below_1(self):
        """ Tests that /feedback/submit rejects feedback with rating that's too low """
        # Arrange
        rating = -1
        comment = 'So bad I used postman just to mess with your ratings'
        request_body = {'rating': rating, 'comment': comment}

        # Act
        response = self.client.post('/feedback/submit', request_body, format='json')

        # Assert
        self.assertEqual(response.status_code, 400)
        self.assertEqual(FeedbackFormResponse.objects.all().count(), 0)

    def test_submit_feedback_rejects_with_rating_above_5(self):
        """ Tests that /feedback/submit rejects feedback with rating that's too high """
        # Arrange
        rating = 6
        comment = 'no'
        request_body = {'rating': rating, 'comment': comment}

        # Act
        response = self.client.post('/feedback/submit', request_body, format='json')

        # Assert
        self.assertEqual(response.status_code, 400)
        self.assertEqual(FeedbackFormResponse.objects.all().count(), 0)
