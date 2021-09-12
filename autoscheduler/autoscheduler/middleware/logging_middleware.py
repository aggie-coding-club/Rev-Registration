import logging
from traceback import format_exc
from django.core.exceptions import MiddlewareNotUsed
from autoscheduler.settings.base import IS_GCP

if IS_GCP:
    import google.cloud.logging

def process_exception(request, _):
    """ Run whenever an exception is encountered in a view.
        While cloud logging will alert us whenever an error occurs in a view,
        this allows us to get information it doesn't provide such as query params
        and the request body.
    """
    message = (
        'Exception raised handling request to '
        f'{request.method} {request.get_full_path()}.\n'
        f'Request body:\n{request.body}\n'
        f'Stack trace information:\n{format_exc()}'
    )
    logging.error(message)

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
