"""
ai_engine/circuit_breaker.py

In-memory circuit breaker with optional Redis backing.
Opens after THRESHOLD consecutive failures, resets after TIMEOUT seconds.
Thread-safe for single-process (Render free tier). Redis used when available.
"""
import time
import logging
import threading
from django.conf import settings

logger = logging.getLogger('ai_engine')

THRESHOLD = getattr(settings, 'AI_CIRCUIT_FAILURE_THRESHOLD', 5)
TIMEOUT   = getattr(settings, 'AI_CIRCUIT_RESET_TIMEOUT', 120)

# In-process fallback state (used when Redis unavailable)
_lock  = threading.Lock()
_state = {'failures': 0, 'opened_at': None, 'is_open': False}


def _cache_key(service: str) -> str:
    return f'ai_circuit:{service}'


def _redis_available() -> bool:
    try:
        from django.core.cache import cache
        cache.get('__ping__')
        return True
    except Exception:
        return False


def is_open(service: str = 'main') -> bool:
    """Return True if circuit is open and reset timeout has not elapsed."""
    if _redis_available():
        try:
            from django.core.cache import cache
            state = cache.get(_cache_key(service))
            if not state:
                return False
            if state.get('is_open'):
                if time.time() - state['opened_at'] > TIMEOUT:
                    logger.info(f'Circuit [{service}] half-open — allowing trial call')
                    return False
                return True
            return False
        except Exception:
            pass

    # fallback: in-process
    with _lock:
        if not _state['is_open']:
            return False
        if time.time() - _state['opened_at'] > TIMEOUT:
            logger.info(f'Circuit [{service}] half-open (in-process)')
            return False
        return True


def record_success(service: str = 'main') -> None:
    if _redis_available():
        try:
            from django.core.cache import cache
            cache.set(_cache_key(service),
                      {'is_open': False, 'failures': 0, 'opened_at': None},
                      timeout=3600)
            return
        except Exception:
            pass
    with _lock:
        _state.update({'is_open': False, 'failures': 0, 'opened_at': None})


def record_failure(service: str = 'main') -> None:
    if _redis_available():
        try:
            from django.core.cache import cache
            state = cache.get(_cache_key(service)) or {'is_open': False, 'failures': 0, 'opened_at': None}
            state['failures'] = state.get('failures', 0) + 1
            if state['failures'] >= THRESHOLD:
                state['is_open']   = True
                state['opened_at'] = time.time()
                logger.warning(f'Circuit [{service}] OPENED after {state["failures"]} failures')
            cache.set(_cache_key(service), state, timeout=3600)
            return
        except Exception:
            pass
    with _lock:
        _state['failures'] += 1
        if _state['failures'] >= THRESHOLD:
            _state['is_open']   = True
            _state['opened_at'] = time.time()
            logger.warning(f'Circuit [{service}] OPENED (in-process)')
