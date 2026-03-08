#!/usr/bin/env python3
"""One-shot multi-platform publisher for crypto creators.

Supports text publishing to:
- Binance Square (official open API)
- X/Twitter (official API mode or browser-session mode)
- Telegram (bot API)
- Threads (official Graph API, optional)
- Farcaster (Neynar API + managed signer, optional)
"""

from __future__ import annotations

import argparse
import base64
import concurrent.futures
import hashlib
import hmac
import json
import os
import secrets
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple

DEFAULT_BINANCE_BASE_URL = "https://www.binance.com/bapi/composite/v1/public/pgc/openApi"
DEFAULT_TWITTER_V2_BASE_URL = "https://api.x.com/2"
DEFAULT_TWITTER_WEB_BASE_URL = "https://api.x.com"
DEFAULT_TELEGRAM_BASE_URL = "https://api.telegram.org"
DEFAULT_THREADS_BASE_URL = "https://graph.threads.net/v1.0"
DEFAULT_FARCASTER_BASE_URL = "https://api.neynar.com/v2/farcaster"

TWITTER_WEB_BEARER_FALLBACK = (
    "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D"
    "1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA"
)

SUPPORTED_PLATFORMS = ("square", "twitter", "tg", "threads", "farcaster")

PLATFORM_SETUP_DOCS = {
    "square": "references/setup-square.md",
    "twitter": "references/setup-twitter-official.md",
    "tg": "references/setup-telegram.md",
    "threads": "references/setup-threads.md",
    "farcaster": "skills/syncx/SKILL.md#farcaster-neynar-setup",
}

TWITTER_MODE_DOCS = {
    "official": "references/setup-twitter-official.md",
    "browser": "references/setup-twitter-browser.md",
}

ENV_TEMPLATE = """# syncx configuration
# Save this file as .env (default path: skills/syncx/.env)

# ---------- Binance Square ----------
BINANCE_SQUARE_API_KEY=

# ---------- X / Twitter (official API mode) ----------
TWITTER_API_KEY=
TWITTER_API_SECRET=
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_SECRET=

# ---------- X / Twitter (browser session mode) ----------
# Export these from your logged-in browser session.
TWITTER_AUTH_TOKEN=
TWITTER_CT0=
# Optional. If omitted, script uses a known web bearer fallback.
TWITTER_WEB_BEARER_TOKEN=

# ---------- Telegram ----------
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
# Optional: e.g. MarkdownV2 / HTML
TELEGRAM_PARSE_MODE=
# Optional: if chat has public username, enables message URL construction
TELEGRAM_CHANNEL_USERNAME=

# ---------- Threads (optional) ----------
THREADS_ACCESS_TOKEN=
THREADS_USER_ID=
# Optional; used only for pretty URL output.
THREADS_USERNAME=

# ---------- Farcaster (Neynar managed signer) ----------
NEYNAR_API_KEY=
FARCASTER_SIGNER_UUID=
"""


def parse_env_file(path: Path) -> Dict[str, str]:
    data: Dict[str, str] = {}
    if not path.exists():
        return data

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        data[key] = value

    return data


def load_config(config_path: Path) -> Dict[str, str]:
    cfg = parse_env_file(config_path)
    # Environment variables override file values.
    for key, value in os.environ.items():
        if key in cfg or key.startswith(
            ("BINANCE_", "TWITTER_", "TELEGRAM_", "THREADS_", "NEYNAR_", "FARCASTER_")
        ):
            cfg[key] = value
    return cfg


def write_env_template(path: Path, force: bool = False) -> Tuple[bool, str]:
    if path.exists() and not force:
        return False, f"Config already exists at {path}. Use --force to overwrite."

    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(ENV_TEMPLATE, encoding="utf-8")
    return True, f"Wrote config template to {path}."


def percent_encode(value: str) -> str:
    return urllib.parse.quote(value, safe="~-._")


def build_oauth1_authorization_header(
    method: str,
    url: str,
    consumer_key: str,
    consumer_secret: str,
    access_token: str,
    access_secret: str,
) -> str:
    oauth_params = {
        "oauth_consumer_key": consumer_key,
        "oauth_nonce": secrets.token_hex(16),
        "oauth_signature_method": "HMAC-SHA1",
        "oauth_timestamp": str(int(time.time())),
        "oauth_token": access_token,
        "oauth_version": "1.0",
    }

    parsed = urllib.parse.urlparse(url)
    base_url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
    query_params = urllib.parse.parse_qsl(parsed.query, keep_blank_values=True)

    sig_params: List[Tuple[str, str]] = list(query_params) + list(oauth_params.items())
    sig_params.sort(key=lambda kv: (percent_encode(kv[0]), percent_encode(kv[1])))
    normalized = "&".join(f"{percent_encode(k)}={percent_encode(v)}" for k, v in sig_params)

    base_string = "&".join(
        [
            percent_encode(method.upper()),
            percent_encode(base_url),
            percent_encode(normalized),
        ]
    )
    signing_key = f"{percent_encode(consumer_secret)}&{percent_encode(access_secret)}"
    signature = base64.b64encode(
        hmac.new(signing_key.encode("utf-8"), base_string.encode("utf-8"), hashlib.sha1).digest()
    ).decode("utf-8")

    oauth_params["oauth_signature"] = signature
    header = "OAuth " + ", ".join(
        f'{percent_encode(k)}="{percent_encode(v)}"' for k, v in oauth_params.items()
    )
    return header


def http_request(
    method: str,
    url: str,
    timeout: int,
    headers: Optional[Dict[str, str]] = None,
    json_body: Optional[Dict[str, Any]] = None,
    form_body: Optional[Dict[str, Any]] = None,
) -> Tuple[int, Any, str]:
    if json_body is not None and form_body is not None:
        raise ValueError("json_body and form_body are mutually exclusive")

    req_headers = dict(headers or {})
    data: Optional[bytes] = None

    if json_body is not None:
        req_headers.setdefault("Content-Type", "application/json")
        data = json.dumps(json_body, ensure_ascii=False).encode("utf-8")
    elif form_body is not None:
        req_headers.setdefault("Content-Type", "application/x-www-form-urlencoded")
        encoded = urllib.parse.urlencode(form_body)
        data = encoded.encode("utf-8")

    request = urllib.request.Request(url=url, method=method.upper(), headers=req_headers, data=data)

    try:
        with urllib.request.urlopen(request, timeout=timeout) as resp:
            status = int(resp.status)
            raw = resp.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as exc:
        status = int(exc.code)
        raw = exc.read().decode("utf-8", errors="replace")
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Network error: {exc.reason}") from exc

    parsed: Any
    if not raw.strip():
        parsed = {}
    else:
        try:
            parsed = json.loads(raw)
        except json.JSONDecodeError:
            parsed = {"raw": raw}

    return status, parsed, raw


def build_error(platform: str, message: str, detail: Optional[Any] = None) -> Dict[str, Any]:
    out = {
        "platform": platform,
        "ok": False,
        "error": message,
    }
    if detail is not None:
        out["detail"] = detail
    return out


def publish_square(cfg: Dict[str, str], text: str, timeout: int, base_url: str) -> Dict[str, Any]:
    key = cfg.get("BINANCE_SQUARE_API_KEY", "").strip()
    if not key:
        return build_error("square", "Missing BINANCE_SQUARE_API_KEY")

    url = f"{base_url.rstrip('/')}/content/add"
    headers = {
        "X-Square-OpenAPI-Key": key,
        "clienttype": "binanceSkill",
        "Content-Type": "application/json",
    }

    try:
        status, payload, raw = http_request(
            method="POST",
            url=url,
            timeout=timeout,
            headers=headers,
            json_body={"bodyTextOnly": text},
        )
    except Exception as exc:  # pylint: disable=broad-except
        return build_error("square", str(exc))

    code = str(payload.get("code", "")) if isinstance(payload, dict) else ""
    content_id = None
    if isinstance(payload, dict):
        data = payload.get("data")
        if isinstance(data, dict):
            content_id = data.get("id")

    success = status < 400 and code == "000000"
    result: Dict[str, Any] = {
        "platform": "square",
        "ok": success,
        "http_status": status,
        "response": payload if isinstance(payload, dict) else {"raw": raw},
    }

    if success:
        result["id"] = str(content_id) if content_id is not None else None
        if content_id:
            result["url"] = f"https://www.binance.com/square/post/{content_id}"
    else:
        result["error"] = payload.get("message") if isinstance(payload, dict) else "Square API call failed"

    return result


def publish_twitter_official(cfg: Dict[str, str], text: str, timeout: int, base_url: str) -> Dict[str, Any]:
    api_key = cfg.get("TWITTER_API_KEY", "").strip()
    api_secret = cfg.get("TWITTER_API_SECRET", "").strip()
    access_token = cfg.get("TWITTER_ACCESS_TOKEN", "").strip()
    access_secret = cfg.get("TWITTER_ACCESS_SECRET", "").strip()

    missing = [
        name
        for name, value in (
            ("TWITTER_API_KEY", api_key),
            ("TWITTER_API_SECRET", api_secret),
            ("TWITTER_ACCESS_TOKEN", access_token),
            ("TWITTER_ACCESS_SECRET", access_secret),
        )
        if not value
    ]
    if missing:
        return build_error("twitter", f"Missing {', '.join(missing)}")

    url = f"{base_url.rstrip('/')}/tweets"
    auth = build_oauth1_authorization_header(
        method="POST",
        url=url,
        consumer_key=api_key,
        consumer_secret=api_secret,
        access_token=access_token,
        access_secret=access_secret,
    )
    headers = {
        "Authorization": auth,
        "Content-Type": "application/json",
    }

    try:
        status, payload, raw = http_request(
            method="POST",
            url=url,
            timeout=timeout,
            headers=headers,
            json_body={"text": text},
        )
    except Exception as exc:  # pylint: disable=broad-except
        return build_error("twitter", str(exc))

    tweet_id = None
    if isinstance(payload, dict):
        data = payload.get("data")
        if isinstance(data, dict):
            tweet_id = data.get("id")

    success = status < 400 and bool(tweet_id)
    result: Dict[str, Any] = {
        "platform": "twitter",
        "mode": "official",
        "ok": success,
        "http_status": status,
        "response": payload if isinstance(payload, dict) else {"raw": raw},
    }

    if success:
        tweet_id_str = str(tweet_id)
        result["id"] = tweet_id_str
        result["url"] = f"https://x.com/i/web/status/{tweet_id_str}"
    else:
        result["error"] = "Twitter official API call failed"

    return result


def publish_twitter_browser(cfg: Dict[str, str], text: str, timeout: int, base_url: str) -> Dict[str, Any]:
    auth_token = cfg.get("TWITTER_AUTH_TOKEN", "").strip()
    ct0 = cfg.get("TWITTER_CT0", "").strip()
    bearer = cfg.get("TWITTER_WEB_BEARER_TOKEN", "").strip() or TWITTER_WEB_BEARER_FALLBACK

    missing = [
        name
        for name, value in (
            ("TWITTER_AUTH_TOKEN", auth_token),
            ("TWITTER_CT0", ct0),
        )
        if not value
    ]
    if missing:
        return build_error("twitter", f"Missing {', '.join(missing)}")

    url = f"{base_url.rstrip('/')}/1.1/statuses/update.json"
    headers = {
        "Authorization": f"Bearer {bearer}",
        "x-csrf-token": ct0,
        "x-twitter-active-user": "yes",
        "x-twitter-auth-type": "OAuth2Session",
        "cookie": f"auth_token={auth_token}; ct0={ct0}",
        "user-agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0.0.0 Safari/537.36"
        ),
        "Content-Type": "application/x-www-form-urlencoded",
    }

    try:
        status, payload, raw = http_request(
            method="POST",
            url=url,
            timeout=timeout,
            headers=headers,
            form_body={"status": text},
        )
    except Exception as exc:  # pylint: disable=broad-except
        return build_error("twitter", str(exc))

    tweet_id = None
    if isinstance(payload, dict):
        tweet_id = payload.get("id_str") or payload.get("id")
        errors = payload.get("errors")
        if errors and not tweet_id:
            return build_error("twitter", "Twitter browser API returned errors", errors)

    success = status < 400 and bool(tweet_id)
    result: Dict[str, Any] = {
        "platform": "twitter",
        "mode": "browser",
        "ok": success,
        "http_status": status,
        "response": payload if isinstance(payload, dict) else {"raw": raw},
    }
    if success:
        tweet_id_str = str(tweet_id)
        result["id"] = tweet_id_str
        result["url"] = f"https://x.com/i/web/status/{tweet_id_str}"
    else:
        result["error"] = "Twitter browser mode call failed"
    return result


def publish_tg(cfg: Dict[str, str], text: str, timeout: int, base_url: str) -> Dict[str, Any]:
    token = cfg.get("TELEGRAM_BOT_TOKEN", "").strip()
    chat_id = cfg.get("TELEGRAM_CHAT_ID", "").strip()
    parse_mode = cfg.get("TELEGRAM_PARSE_MODE", "").strip()
    username_hint = cfg.get("TELEGRAM_CHANNEL_USERNAME", "").strip().lstrip("@")

    missing = [
        name
        for name, value in (
            ("TELEGRAM_BOT_TOKEN", token),
            ("TELEGRAM_CHAT_ID", chat_id),
        )
        if not value
    ]
    if missing:
        return build_error("tg", f"Missing {', '.join(missing)}")

    url = f"{base_url.rstrip('/')}/bot{token}/sendMessage"
    form: Dict[str, Any] = {
        "chat_id": chat_id,
        "text": text,
        "disable_web_page_preview": "true",
    }
    if parse_mode:
        form["parse_mode"] = parse_mode

    try:
        status, payload, raw = http_request(
            method="POST",
            url=url,
            timeout=timeout,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            form_body=form,
        )
    except Exception as exc:  # pylint: disable=broad-except
        return build_error("tg", str(exc))

    is_ok = bool(isinstance(payload, dict) and payload.get("ok") is True and status < 400)
    result: Dict[str, Any] = {
        "platform": "tg",
        "ok": is_ok,
        "http_status": status,
        "response": payload if isinstance(payload, dict) else {"raw": raw},
    }

    if not is_ok:
        result["error"] = "Telegram sendMessage failed"
        return result

    msg = payload.get("result") if isinstance(payload, dict) else None
    message_id = msg.get("message_id") if isinstance(msg, dict) else None
    chat = msg.get("chat") if isinstance(msg, dict) else None
    username = username_hint

    if isinstance(chat, dict):
        username = username or str(chat.get("username") or "")

    if message_id is not None:
        result["message_id"] = message_id
    if username and message_id is not None:
        result["url"] = f"https://t.me/{username}/{message_id}"

    return result


def publish_threads(cfg: Dict[str, str], text: str, timeout: int, base_url: str) -> Dict[str, Any]:
    token = cfg.get("THREADS_ACCESS_TOKEN", "").strip()
    user_id = cfg.get("THREADS_USER_ID", "").strip()
    username = cfg.get("THREADS_USERNAME", "").strip().lstrip("@")

    missing = [
        name
        for name, value in (
            ("THREADS_ACCESS_TOKEN", token),
            ("THREADS_USER_ID", user_id),
        )
        if not value
    ]
    if missing:
        return build_error("threads", f"Missing {', '.join(missing)}")

    create_url = f"{base_url.rstrip('/')}/{user_id}/threads"
    publish_url = f"{base_url.rstrip('/')}/{user_id}/threads_publish"

    try:
        create_status, create_payload, _ = http_request(
            method="POST",
            url=create_url,
            timeout=timeout,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            form_body={
                "media_type": "TEXT",
                "text": text,
                "access_token": token,
            },
        )
    except Exception as exc:  # pylint: disable=broad-except
        return build_error("threads", str(exc))

    creation_id = None
    if isinstance(create_payload, dict):
        creation_id = create_payload.get("id")

    if create_status >= 400 or not creation_id:
        return {
            "platform": "threads",
            "ok": False,
            "http_status": create_status,
            "error": "Threads createMediaContainer failed",
            "response": create_payload,
        }

    try:
        publish_status, publish_payload, _ = http_request(
            method="POST",
            url=publish_url,
            timeout=timeout,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            form_body={
                "creation_id": str(creation_id),
                "access_token": token,
            },
        )
    except Exception as exc:  # pylint: disable=broad-except
        return build_error("threads", str(exc))

    thread_id = None
    if isinstance(publish_payload, dict):
        thread_id = publish_payload.get("id")

    success = publish_status < 400 and bool(thread_id)
    result: Dict[str, Any] = {
        "platform": "threads",
        "ok": success,
        "http_status": publish_status,
        "creation_id": creation_id,
        "response": publish_payload,
    }

    if success:
        thread_id_str = str(thread_id)
        result["id"] = thread_id_str
        if username:
            result["url"] = f"https://www.threads.net/@{username}/post/{thread_id_str}"
    else:
        result["error"] = "Threads publish failed"

    return result


def publish_farcaster(cfg: Dict[str, str], text: str, timeout: int, base_url: str) -> Dict[str, Any]:
    api_key = cfg.get("NEYNAR_API_KEY", "").strip()
    signer_uuid = cfg.get("FARCASTER_SIGNER_UUID", "").strip()

    missing = [
        name
        for name, value in (
            ("NEYNAR_API_KEY", api_key),
            ("FARCASTER_SIGNER_UUID", signer_uuid),
        )
        if not value
    ]
    if missing:
        return build_error("farcaster", f"Missing {', '.join(missing)}")

    url = f"{base_url.rstrip('/')}/cast"
    headers = {
        "x-api-key": api_key,
        "Content-Type": "application/json",
    }

    try:
        status, payload, raw = http_request(
            method="POST",
            url=url,
            timeout=timeout,
            headers=headers,
            json_body={"text": text, "signer_uuid": signer_uuid},
        )
    except Exception as exc:  # pylint: disable=broad-except
        return build_error("farcaster", str(exc))

    cast = payload.get("cast") if isinstance(payload, dict) else None
    cast_hash = cast.get("hash") if isinstance(cast, dict) else None
    author = cast.get("author") if isinstance(cast, dict) else None
    username = author.get("username") if isinstance(author, dict) else None

    success = status < 400 and bool(cast_hash)
    result: Dict[str, Any] = {
        "platform": "farcaster",
        "ok": success,
        "http_status": status,
        "response": payload if isinstance(payload, dict) else {"raw": raw},
    }

    if success:
        cast_hash_str = str(cast_hash)
        result["id"] = cast_hash_str
        if username:
            result["url"] = f"https://warpcast.com/{username}/{cast_hash_str}"
    else:
        result["error"] = (
            payload.get("message")
            if isinstance(payload, dict)
            else "Farcaster publish failed"
        )

    return result


def parse_platforms(raw: str) -> List[str]:
    if not raw.strip():
        return ["square", "twitter"]

    requested: List[str] = []
    for item in raw.split(","):
        p = item.strip().lower()
        if not p:
            continue
        if p not in SUPPORTED_PLATFORMS:
            raise ValueError(f"Unsupported platform: {p}. Supported: {', '.join(SUPPORTED_PLATFORMS)}")
        if p not in requested:
            requested.append(p)

    if not requested:
        raise ValueError("No platforms selected")
    return requested


def required_keys_for(platform: str, twitter_mode: str) -> List[str]:
    if platform == "square":
        return ["BINANCE_SQUARE_API_KEY"]
    if platform == "twitter":
        if twitter_mode == "official":
            return [
                "TWITTER_API_KEY",
                "TWITTER_API_SECRET",
                "TWITTER_ACCESS_TOKEN",
                "TWITTER_ACCESS_SECRET",
            ]
        return ["TWITTER_AUTH_TOKEN", "TWITTER_CT0"]
    if platform == "tg":
        return ["TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID"]
    if platform == "threads":
        return ["THREADS_ACCESS_TOKEN", "THREADS_USER_ID"]
    if platform == "farcaster":
        return ["NEYNAR_API_KEY", "FARCASTER_SIGNER_UUID"]
    return []


def build_doctor_next_steps(
    config_path: Path,
    platforms: List[str],
    twitter_mode: str,
    missing_map: Dict[str, List[str]],
    config_exists: bool,
) -> List[Dict[str, str]]:
    steps: List[Dict[str, str]] = []

    if not config_exists:
        steps.append(
            {
                "title": "Create config file",
                "command": f"python3 scripts/publish_sync.py --init-config --config {config_path}",
                "reference": "references/get-started.md",
            }
        )

    for platform in platforms:
        if platform not in missing_map:
            continue

        reference = PLATFORM_SETUP_DOCS.get(platform, "references/get-started.md")
        if platform == "twitter":
            reference = TWITTER_MODE_DOCS.get(twitter_mode, reference)

        steps.append(
            {
                "title": f"Fill missing {platform} keys",
                "command": f"python3 scripts/publish_sync.py --doctor --platforms {platform} --twitter-mode {twitter_mode}",
                "reference": reference,
            }
        )

    if missing_map:
        steps.append(
            {
                "title": "Re-check all selected platforms",
                "command": f"python3 scripts/publish_sync.py --doctor --platforms {','.join(platforms)} --twitter-mode {twitter_mode}",
                "reference": "references/troubleshooting.md",
            }
        )
    else:
        steps.append(
            {
                "title": "Publish now",
                "command": f"python3 scripts/publish_sync.py --text \"<your_text>\" --platforms {','.join(platforms)} --twitter-mode {twitter_mode}",
                "reference": "references/get-started.md",
            }
        )

    return steps


def run_doctor(cfg: Dict[str, str], config_path: Path, platforms: Iterable[str], twitter_mode: str) -> Dict[str, Any]:
    platform_list = list(platforms)
    config_exists = config_path.exists()
    check = {
        "ok": True,
        "twitter_mode": twitter_mode,
        "platforms": platform_list,
        "config_exists": config_exists,
        "missing": {},
    }

    for platform in platform_list:
        missing = [k for k in required_keys_for(platform, twitter_mode) if not cfg.get(k, "").strip()]
        if missing:
            check["ok"] = False
            check["missing"][platform] = missing

    check["next_steps"] = build_doctor_next_steps(
        config_path=config_path,
        platforms=platform_list,
        twitter_mode=twitter_mode,
        missing_map=check["missing"],
        config_exists=config_exists,
    )

    return check


def publish_all(
    cfg: Dict[str, str],
    text: str,
    platforms: List[str],
    twitter_mode: str,
    timeout: int,
    binance_base_url: str,
    twitter_base_url: str,
    twitter_web_base_url: str,
    telegram_base_url: str,
    threads_base_url: str,
    farcaster_base_url: str,
    sequential: bool,
) -> Dict[str, Any]:
    jobs = {}
    for platform in platforms:
        if platform == "square":
            jobs[platform] = lambda p=platform: publish_square(cfg, text, timeout, binance_base_url)
        elif platform == "twitter":
            if twitter_mode == "official":
                jobs[platform] = lambda p=platform: publish_twitter_official(cfg, text, timeout, twitter_base_url)
            else:
                jobs[platform] = lambda p=platform: publish_twitter_browser(cfg, text, timeout, twitter_web_base_url)
        elif platform == "tg":
            jobs[platform] = lambda p=platform: publish_tg(cfg, text, timeout, telegram_base_url)
        elif platform == "threads":
            jobs[platform] = lambda p=platform: publish_threads(cfg, text, timeout, threads_base_url)
        elif platform == "farcaster":
            jobs[platform] = lambda p=platform: publish_farcaster(cfg, text, timeout, farcaster_base_url)

    results: Dict[str, Any] = {}

    if sequential or len(jobs) <= 1:
        for platform, fn in jobs.items():
            results[platform] = fn()
    else:
        with concurrent.futures.ThreadPoolExecutor(max_workers=len(jobs)) as executor:
            future_to_platform = {executor.submit(fn): platform for platform, fn in jobs.items()}
            for future in concurrent.futures.as_completed(future_to_platform):
                platform = future_to_platform[future]
                try:
                    results[platform] = future.result()
                except Exception as exc:  # pylint: disable=broad-except
                    results[platform] = build_error(platform, f"Unhandled publish exception: {exc}")

    ok = all(bool(item.get("ok")) for item in results.values()) if results else False
    return {
        "ok": ok,
        "platforms": platforms,
        "twitter_mode": twitter_mode,
        "results": results,
    }


def read_text_arg(text: Optional[str], text_file: Optional[Path]) -> str:
    if text is not None and text.strip():
        return text.strip()

    if text_file is not None:
        if not text_file.exists():
            raise ValueError(f"text file not found: {text_file}")
        content = text_file.read_text(encoding="utf-8").strip()
        if content:
            return content

    raise ValueError("Post text is empty. Provide --text or --text-file.")


def parse_args() -> argparse.Namespace:
    script_dir = Path(__file__).resolve().parent
    default_cfg = script_dir.parent / ".env"

    parser = argparse.ArgumentParser(description="Publish one text to multiple social platforms")
    parser.add_argument("--text", help="Text to publish")
    parser.add_argument("--text-file", type=Path, help="Read post text from file")
    parser.add_argument(
        "--platforms",
        default="square,twitter",
        help="Comma-separated: square,twitter,tg,threads,farcaster (default: square,twitter)",
    )
    parser.add_argument(
        "--twitter-mode",
        choices=("official", "browser"),
        default="official",
        help="Twitter publish mode (default: official)",
    )
    parser.add_argument("--config", type=Path, default=default_cfg, help=f"Env file path (default: {default_cfg})")
    parser.add_argument("--timeout", type=int, default=25, help="HTTP timeout in seconds")
    parser.add_argument("--json-indent", type=int, default=2, help="JSON output indent")
    parser.add_argument("--dry-run", action="store_true", help="Validate config and print execution plan only")
    parser.add_argument("--doctor", action="store_true", help="Only check required config keys")
    parser.add_argument("--init-config", action="store_true", help="Create config template then exit")
    parser.add_argument("--force", action="store_true", help="Allow overwriting config when used with --init-config")
    parser.add_argument("--sequential", action="store_true", help="Publish sequentially instead of parallel")

    parser.add_argument("--binance-base-url", default=DEFAULT_BINANCE_BASE_URL)
    parser.add_argument("--twitter-base-url", default=DEFAULT_TWITTER_V2_BASE_URL)
    parser.add_argument("--twitter-web-base-url", default=DEFAULT_TWITTER_WEB_BASE_URL)
    parser.add_argument("--telegram-base-url", default=DEFAULT_TELEGRAM_BASE_URL)
    parser.add_argument("--threads-base-url", default=DEFAULT_THREADS_BASE_URL)
    parser.add_argument("--farcaster-base-url", default=DEFAULT_FARCASTER_BASE_URL)

    return parser.parse_args()


def main() -> int:
    args = parse_args()

    if args.init_config:
        wrote, message = write_env_template(args.config, force=args.force)
        payload = {"ok": wrote, "message": message, "path": str(args.config)}
        print(json.dumps(payload, ensure_ascii=False, indent=args.json_indent))
        return 0 if wrote else 1

    try:
        platforms = parse_platforms(args.platforms)
    except ValueError as exc:
        print(json.dumps(build_error("cli", str(exc)), ensure_ascii=False, indent=args.json_indent))
        return 1

    cfg = load_config(args.config)
    doctor = run_doctor(cfg, args.config, platforms, args.twitter_mode)

    if args.doctor:
        out = {
            "ok": doctor["ok"],
            "config": str(args.config),
            "doctor": doctor,
        }
        print(json.dumps(out, ensure_ascii=False, indent=args.json_indent))
        return 0 if doctor["ok"] else 2

    try:
        text = read_text_arg(args.text, args.text_file)
    except ValueError as exc:
        print(json.dumps(build_error("cli", str(exc)), ensure_ascii=False, indent=args.json_indent))
        return 1

    if args.dry_run:
        out = {
            "ok": doctor["ok"],
            "dry_run": True,
            "config": str(args.config),
            "text_length": len(text),
            "platforms": platforms,
            "twitter_mode": args.twitter_mode,
            "doctor": doctor,
        }
        print(json.dumps(out, ensure_ascii=False, indent=args.json_indent))
        return 0 if doctor["ok"] else 2

    result = publish_all(
        cfg=cfg,
        text=text,
        platforms=platforms,
        twitter_mode=args.twitter_mode,
        timeout=args.timeout,
        binance_base_url=args.binance_base_url,
        twitter_base_url=args.twitter_base_url,
        twitter_web_base_url=args.twitter_web_base_url,
        telegram_base_url=args.telegram_base_url,
        threads_base_url=args.threads_base_url,
        farcaster_base_url=args.farcaster_base_url,
        sequential=args.sequential,
    )

    result["config"] = str(args.config)
    result["text_length"] = len(text)
    print(json.dumps(result, ensure_ascii=False, indent=args.json_indent))
    return 0 if result.get("ok") else 2


if __name__ == "__main__":
    sys.exit(main())
