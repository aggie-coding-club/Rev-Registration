import logging
from traceback import format_exc

class LoggingMiddleware:
    """ Middleware to log exceptions encountered while handling requests.
        Note that while Django console logs these by default, outside of debug mode
        they are not processed (meaning GCP doesn't have access to any error information)
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        return response

    def process_exception(self, request, _):
        """ Run whenever an exception is encountered in a view """
        message = (
            'Exception raised handling request to '
            f'{request.method} {request.get_full_path()}.\n'
            f'Request body:\n{request.body}\n'
            f'{format_exc()}'
        )
        logging.error(message)
