#!/usr/bin/env python3
"""Local smoke tests for syncx publisher.

This spins up a local mock server and validates:
1) multi-platform publish flow (Square + X official + TG + Threads)
2) X browser-session mode flow
"""

from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Dict, Tuple


class MockHandler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def _read_body(self) -> str:
        length = int(self.headers.get("Content-Length", "0") or 0)
        if length <= 0:
            return ""
        return self.rfile.read(length).decode("utf-8", errors="replace")

    def _send_json(self, status: int, payload: Dict):
        data = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_POST(self):  # noqa: N802
        _ = self._read_body()

        if self.path == "/bapi/composite/v1/public/pgc/openApi/content/add":
            return self._send_json(200, {"code": "000000", "message": None, "data": {"id": "sq_12345"}})

        if self.path == "/2/tweets":
            return self._send_json(201, {"data": {"id": "x_98765", "text": "ok"}})

        if self.path == "/1.1/statuses/update.json":
            return self._send_json(200, {"id_str": "x_web_1122", "text": "ok"})

        if self.path == "/botTEST_BOT_TOKEN/sendMessage":
            return self._send_json(
                200,
                {
                    "ok": True,
                    "result": {
                        "message_id": 77,
                        "chat": {"id": -100123456, "username": "ct_sync_channel"},
                    },
                },
            )

        if self.path == "/v1.0/42/threads":
            return self._send_json(200, {"id": "threads_creation_1"})

        if self.path == "/v1.0/42/threads_publish":
            return self._send_json(200, {"id": "threads_post_1"})

        return self._send_json(404, {"error": f"No mock route for {self.path}"})

    def log_message(self, fmt, *args):  # noqa: A003
        # Quiet test output.
        return


def start_server() -> Tuple[ThreadingHTTPServer, str]:
    server = ThreadingHTTPServer(("127.0.0.1", 0), MockHandler)
    host, port = server.server_address
    base_url = f"http://{host}:{port}"
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server, base_url


def run_cmd(cmd):
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(
            f"Command failed ({proc.returncode})\nCMD: {' '.join(cmd)}\nSTDOUT:\n{proc.stdout}\nSTDERR:\n{proc.stderr}"
        )
    try:
        return json.loads(proc.stdout)
    except json.JSONDecodeError as exc:
        raise RuntimeError(f"Non-JSON output:\n{proc.stdout}\n{proc.stderr}") from exc


def assert_ok(payload: Dict, label: str):
    if not payload.get("ok"):
        raise RuntimeError(f"{label} failed:\n{json.dumps(payload, ensure_ascii=False, indent=2)}")


def main() -> int:
    script_path = Path(__file__).resolve().parent / "publish_sync.py"
    server, base = start_server()

    try:
        with tempfile.TemporaryDirectory(prefix="syncx-test-") as tmp:
            env_path = Path(tmp) / ".env"
            env_path.write_text(
                "\n".join(
                    [
                        "BINANCE_SQUARE_API_KEY=demo_square_key",
                        "TWITTER_API_KEY=demo_api_key",
                        "TWITTER_API_SECRET=demo_api_secret",
                        "TWITTER_ACCESS_TOKEN=demo_access_token",
                        "TWITTER_ACCESS_SECRET=demo_access_secret",
                        "TWITTER_AUTH_TOKEN=demo_auth_token",
                        "TWITTER_CT0=demo_ct0",
                        "TELEGRAM_BOT_TOKEN=TEST_BOT_TOKEN",
                        "TELEGRAM_CHAT_ID=-100123456",
                        "THREADS_ACCESS_TOKEN=demo_threads_token",
                        "THREADS_USER_ID=42",
                        "THREADS_USERNAME=ctsync",
                    ]
                ),
                encoding="utf-8",
            )

            cmd_official = [
                sys.executable,
                str(script_path),
                "--config",
                str(env_path),
                "--text",
                "hello crypto world",
                "--platforms",
                "square,twitter,tg,threads",
                "--twitter-mode",
                "official",
                "--binance-base-url",
                f"{base}/bapi/composite/v1/public/pgc/openApi",
                "--twitter-base-url",
                f"{base}/2",
                "--telegram-base-url",
                base,
                "--threads-base-url",
                f"{base}/v1.0",
            ]
            official_payload = run_cmd(cmd_official)
            assert_ok(official_payload, "official mode")

            cmd_browser = [
                sys.executable,
                str(script_path),
                "--config",
                str(env_path),
                "--text",
                "hello from browser mode",
                "--platforms",
                "twitter",
                "--twitter-mode",
                "browser",
                "--twitter-web-base-url",
                base,
            ]
            browser_payload = run_cmd(cmd_browser)
            assert_ok(browser_payload, "browser mode")

            out = {
                "ok": True,
                "official": official_payload,
                "browser": browser_payload,
            }
            print(json.dumps(out, ensure_ascii=False, indent=2))

    finally:
        server.shutdown()
        server.server_close()

    return 0


if __name__ == "__main__":
    sys.exit(main())
