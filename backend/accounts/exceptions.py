"""
accounts/exceptions.py — Custom DRF exception handler.
Maps exceptions to the API response format specified in AGENTS.md.
"""
import uuid
import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        # Unhandled exception → 500
        request_id = str(uuid.uuid4())[:8]
        logger.exception('Unhandled exception [%s]', request_id, exc_info=exc)
        return Response(
            {'error': f'An unexpected error occurred. Reference: {request_id}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    # Normalise DRF validation errors → { "errors": { "field": ["msg"] } }
    if response.status_code == 400:
        if isinstance(response.data, dict) and 'errors' not in response.data:
            response.data = {'errors': response.data}

    return response
