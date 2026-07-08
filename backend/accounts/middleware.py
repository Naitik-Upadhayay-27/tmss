"""
accounts/middleware.py — RequestLoggingMiddleware
Logs method, path, status, and duration for every request.
"""
import time
import logging

logger = logging.getLogger('tms.requests')


class RequestLoggingMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start = time.monotonic()
        response = self.get_response(request)
        duration_ms = round((time.monotonic() - start) * 1000)

        user = getattr(request, 'user', None)
        user_info = f'user={user.id}' if user and user.is_authenticated else 'anon'

        logger.info(
            '%s %s %s %dms [%s]',
            request.method,
            request.path,
            response.status_code,
            duration_ms,
            user_info,
        )
        return response
