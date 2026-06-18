#!/usr/bin/env python3
"""Local static server with Vercel-style clean URLs (/beles -> beles.html)."""

from __future__ import annotations

import http.server
import os
import re
import socketserver
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PORT = int(os.environ.get("PORT", "8080"))
DEV_CACHE_BUST = "no-store, no-cache, must-revalidate, max-age=0"
GIT_REV = "unknown"


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

    def is_html_path(self, path: str) -> bool:
        clean = path.split("?", 1)[0].split("#", 1)[0]
        return clean.endswith(".html") or clean in ("", "/")

    def rewrite_html(self, html: str) -> str:
        """Force fresh script URLs on every HTML response during local dev."""
        def bump_script(match: re.Match[str]) -> str:
            prefix = match.group(1)
            file = match.group(2)
            return f"{prefix}{file}?rev={GIT_REV}\""

        html = re.sub(
            r'(src="(?:/)?)(script\.js)(\?[^"]*)?"',
            bump_script,
            html,
        )
        html = re.sub(
            r'(src="(?:/)?)(data/products\.js)(\?[^"]*)?"',
            bump_script,
            html,
        )
        return html

    def serve_rewritten_html(self, file_path: Path) -> None:
        try:
            body = self.rewrite_html(file_path.read_text(encoding="utf-8")).encode("utf-8")
        except OSError as err:
            self.send_error(404, str(err))
            return

        self.send_response(200)
        self.send_header("Content-type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def end_headers(self) -> None:
        path = self.path.split("?", 1)[0].split("#", 1)[0]
        if self.is_dev_asset(path):
            self.send_header("Cache-Control", DEV_CACHE_BUST)
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")
            self.send_header("X-Eillon-Git-Rev", GIT_REV)
        super().end_headers()

    def do_GET(self) -> None:
        resolved = self.resolve_clean_url(self.path)
        if resolved:
            self.path = resolved

        path = self.path.split("?", 1)[0].split("#", 1)[0]
        if self.is_dev_asset(path):
            if "If-Modified-Since" in self.headers:
                del self.headers["If-Modified-Since"]
            if "If-None-Match" in self.headers:
                del self.headers["If-None-Match"]

        if self.is_html_path(path):
            rel = path.lstrip("/") or "index.html"
            file_path = ROOT / rel
            if file_path.is_file():
                self.serve_rewritten_html(file_path)
                return

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


class ReuseTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


def main() -> None:
    global GIT_REV
    os.chdir(ROOT)
    GIT_REV = git_head()

    with ReuseTCPServer(("", PORT), CleanUrlHandler) as httpd:
        print(f"Serving {ROOT}")
        print(f"Git:    {GIT_REV}")
        print("Expect: Out of stock on /store — all four chapter cards")
        print(f"Local:  http://localhost:{PORT}/")
        print(f"Store:  http://localhost:{PORT}/store")
        print(f"Check:  node scripts/verify-out-of-stock.mjs")
        print("Note: /api/* requires `npx vercel dev` for waitlist endpoints.")
        print("Press Ctrl+C to stop.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped.")


if __name__ == "__main__":
    main()
