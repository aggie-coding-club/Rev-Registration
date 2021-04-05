from django.core.exceptions import MiddlewareNotUsed
from autoscheduler.settings.base import IS_GCP

if IS_GCP:
    import google.cloud.logging

class LoggingMiddleware:
    """ Middleware that connects Google Cloud Logging on GCP to python's logging module.
        Note that while Django console logs these by default, outside of debug mode
        they are not processed (meaning GCP doesn't have access to any error information)
    """
    def __init__(self, get_response):
        if not IS_GCP:
            raise MiddlewareNotUsed

        # Set up google cloud logging (if on GCP)
        cloud_logging_client = google.cloud.logging.Client()
        cloud_logging_client.get_default_handler()
        cloud_logging_client.setup_logging()

        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        return response
