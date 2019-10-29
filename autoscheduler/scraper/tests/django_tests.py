from django.test import TestCase

class DjangoTestCase(TestCase):
    def test_thing(self):
        self.assertEqual(1, 1)
