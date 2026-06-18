#!/usr/bin/env python3
"""Local static server with Vercel-style clean URLs (/beles -> beles.html)."""

from __future__ import annotations

import http.server
import os
import socketserver
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PORT = int(os.environ.get("PORT", "8080"))
DEV_CACHE_BUST = "no-store, no-cache, must-revalidate, max-age=0"


class CleanUrlHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def resolve_clean_url(self, path: str) -> str | None:
        clean = path.split("?", 1)[0].split("#", 1)[0]
        if clean in ("", "/"):
            return "/index.html"

        rel = clean.lstrip("/")
        if not rel or "/" in rel and rel.endswith("/"):
            return None

        basename = os.path.basename(rel)
        if "." in basename:
            return None

        html_file = ROOT / f"{rel}.html"
        if html_file.is_file():
            return "/" + rel.replace("\\", "/") + ".html"

        return None

    def is_dev_asset(self, path: str) -> bool:
        clean = path.split("?", 1)[0].split("#", 1)[0]
        return clean.endswith((".html", ".js", ".css")) or clean in ("", "/")

    def end_headers(self) -> None:
        path = self.path.split("?", 1)[0].split("#", 1)[0]
        if self.is_dev_asset(path):
            self.send_header("Cache-Control", DEV_CACHE_BUST)
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")
        super().end_headers()

    def do_GET(self) -> None:
        resolved = self.resolve_clean_url(self.path)
        if resolved:
            self.path = resolved
        path = self.path.split("?", 1)[0].split("#", 1)[0]
        if self.is_dev_asset(path):
            # Never serve 304 for site assets — avoids stale JS/CSS during local dev.
            if "If-Modified-Since" in self.headers:
                del self.headers["If-Modified-Since"]
            if "If-None-Match" in self.headers:
                del self.headers["If-None-Match"]
        super().do_GET()

    def log_message(self, format: str, *args) -> None:
        print(f"[dev] {self.address_string()} - {format % args}")


def git_head() -> str:
    try:
        return subprocess.check_output(
            ["git", "rev-parse", "--short", "HEAD"],
            cwd=ROOT,
            text=True,
        ).strip()
    except (subprocess.CalledProcessError, FileNotFoundError):
        return "unknown"


def main() -> None:
    os.chdir(ROOT)
    rev = git_head()
    with socketserver.TCPServer(("", PORT), CleanUrlHandler) as httpd:
        print(f"Serving {ROOT}")
        print(f"Git:    {rev} (store should show Out of stock on all chapters)")
        print(f"Local:  http://localhost:{PORT}/")
        print(f"Beles:  http://localhost:{PORT}/beles")
        print(f"Store:  http://localhost:{PORT}/store")
        print("Note: /api/* requires `npx vercel dev` for waitlist endpoints.")
        print("Press Ctrl+C to stop.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped.")


if __name__ == "__main__":
    main()
