"""
ai_engine/client.py

Groq API client (OpenAI-compatible) with:
- PII scrubbing before any data leaves the system
- Per-user and per-IP rate limiting
- Request timeout enforcement
- Structured logging for audit trail
"""
import re
import time
import logging
import requests
from django.conf import settings

logger = logging.getLogger('ai_engine')

GROQ_API_KEY  = getattr(settings, 'GROQ_API_KEY', '')
GROQ_BASE_URL = getattr(settings, 'GROQ_BASE_URL', 'https://api.groq.com/openai/v1')
CHAT_MODEL    = getattr(settings, 'GROQ_CHAT_MODEL', 'llama-3.1-8b-instant')
TIMEOUT       = getattr(settings, 'AI_REQUEST_TIMEOUT', 15)

RATE_LIMIT_USER_DAY    = getattr(settings, 'AI_RATE_LIMIT_PER_USER_DAY', 200)
RATE_LIMIT_IP_MINUTE   = getattr(settings, 'AI_RATE_LIMIT_PER_IP_MINUTE', 20)


class AIClientError(Exception):
    pass


class AITimeoutError(AIClientError):
    pass


class AIRateLimitError(AIClientError):
    pass


# ── PII scrubbing ─────────────────────────────────────────────────────────────

_PII_PATTERNS = [
    (re.compile(r'\b[6-9]\d{9}\b'), '[PHONE]'),                          # Indian mobile
    (re.compile(r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b'), '[AADHAAR]'),      # Aadhaar
    (re.compile(r'\b[A-Z]{5}[0-9]{4}[A-Z]\b'), '[PAN]'),                # PAN card
    (re.compile(r'[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}'), '[EMAIL]'),
    (re.compile(r'\b\d{16}\b'), '[CARD]'),                               # card numbers
    (re.compile(r'\b\d{9,18}\b'), '[ACCT]'),                             # account numbers
]


def scrub_pii(text: str) -> str:
    """Remove PII before sending any data to external AI APIs."""
    for pattern, replacement in _PII_PATTERNS:
        text = pattern.sub(replacement, text)
    return text


# ── Rate limiting (Django cache backed) ───────────────────────────────────────

def _check_rate_limit(user_id: int | None, ip: str | None) -> None:
    """
    Raises AIRateLimitError if user or IP exceeds configured limits.
    Silently skips if cache is unavailable (fail-open for rate limiting).
    """
    try:
        from django.core.cache import cache

        if user_id:
            key   = f'ai_rl_user:{user_id}:{time.strftime("%Y%m%d")}'
            count = cache.get(key, 0)
            if count >= RATE_LIMIT_USER_DAY:
                raise AIRateLimitError(f'Daily AI limit reached for user {user_id}')
            cache.set(key, count + 1, timeout=86400)

        if ip:
            key   = f'ai_rl_ip:{ip}:{time.strftime("%Y%m%d%H%M")}'
            count = cache.get(key, 0)
            if count >= RATE_LIMIT_IP_MINUTE:
                raise AIRateLimitError(f'Per-minute AI limit reached for IP {ip}')
            cache.set(key, count + 1, timeout=60)

    except AIRateLimitError:
        raise
    except Exception:
        pass  # cache unavailable — allow request


# ── Core chat completion ──────────────────────────────────────────────────────

def chat_completion(
    messages: list[dict],
    max_tokens: int = 400,
    temperature: float = 0.2,
    user_id: int | None = None,
    ip: str | None = None,
) -> dict:
    """
    Send a chat completion request to Groq.
    Returns dict: { content, tokens_used, model }
    Scrubs PII from all message content before sending.
    Enforces rate limits per user and per IP.
    """
    if not GROQ_API_KEY:
        raise AIClientError('GROQ_API_KEY not configured')

    _check_rate_limit(user_id, ip)

    # Scrub PII from every message
    clean_messages = [
        {**msg, 'content': scrub_pii(msg.get('content', ''))}
        for msg in messages
    ]

    payload = {
        'model':       CHAT_MODEL,
        'messages':    clean_messages,
        'max_tokens':  max_tokens,
        'temperature': temperature,
    }

    headers = {
        'Authorization': f'Bearer {GROQ_API_KEY}',
        'Content-Type':  'application/json',
    }

    start = time.monotonic()
    try:
        resp = requests.post(
            f'{GROQ_BASE_URL}/chat/completions',
            json=payload,
            headers=headers,
            timeout=TIMEOUT,
        )
        resp.raise_for_status()
        elapsed      = int((time.monotonic() - start) * 1000)
        resp_json    = resp.json()
        content      = resp_json['choices'][0]['message']['content'].strip()
        tokens_used  = resp_json.get('usage', {}).get('total_tokens', 0)
        logger.info('groq.chat_completion ok model=%s tokens=%s latency_ms=%s',
                    CHAT_MODEL, tokens_used, elapsed)

        # Track cumulative daily token usage per user in cache
        if user_id:
            try:
                from django.core.cache import cache
                token_key = f'ai_tokens_user:{user_id}:{time.strftime("%Y%m%d")}'
                cache.set(token_key, cache.get(token_key, 0) + tokens_used, timeout=86400)
            except Exception:
                pass

        return {'content': content, 'tokens_used': tokens_used, 'model': CHAT_MODEL}

    except requests.exceptions.Timeout:
        raise AITimeoutError(f'Groq timeout after {TIMEOUT}s')
    except requests.exceptions.HTTPError as e:
        if e.response is not None and e.response.status_code == 429:
            raise AIRateLimitError('Groq upstream rate limit hit')
        raise AIClientError(f'Groq HTTP error: {e}')
    except requests.exceptions.RequestException as e:
        raise AIClientError(f'Groq request error: {e}')


def get_user_usage(user_id: int) -> dict:
    """Return today's request count and token count for a user."""
    try:
        from django.core.cache import cache
        today = time.strftime('%Y%m%d')
        req_count   = cache.get(f'ai_rl_user:{user_id}:{today}', 0)
        token_count = cache.get(f'ai_tokens_user:{user_id}:{today}', 0)
        return {
            'requests_today':  req_count,
            'requests_limit':  RATE_LIMIT_USER_DAY,
            'tokens_today':    token_count,
        }
    except Exception:
        return {'requests_today': 0, 'requests_limit': RATE_LIMIT_USER_DAY, 'tokens_today': 0}


def health_check() -> dict:
    """Check if Groq API is reachable with a minimal request."""
    if not GROQ_API_KEY:
        return {'groq': False, 'reason': 'API key not configured'}
    try:
        result = chat_completion(
            [{'role': 'user', 'content': 'Reply with the single word: ok'}],
            max_tokens=5,
            temperature=0,
        )
        return {'groq': True, 'model': CHAT_MODEL, 'response': result['content']}
    except AIRateLimitError:
        return {'groq': True, 'reason': 'rate_limited'}
    except Exception as e:
        return {'groq': False, 'reason': str(e)}
