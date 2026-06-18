#!/usr/bin/env python3
"""Local static server with Vercel-style clean URLs (/beles -> beles.html)."""

from __future__ import annotations

import http.server
import os
import socketserver
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PORT = int(os.environ.get("PORT", "8080"))


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

    def end_headers(self) -> None:
        path = self.path.split("?", 1)[0].split("#", 1)[0]
        if path.endswith((".html", ".js", ".css")) or path in ("", "/"):
            self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
            self.send_header("Pragma", "no-cache")
        super().end_headers()

    def do_GET(self) -> None:
        resolved = self.resolve_clean_url(self.path)
        if resolved:
            self.path = resolved
        super().do_GET()

    def log_message(self, format: str, *args) -> None:
        print(f"[dev] {self.address_string()} - {format % args}")


def main() -> None:
    os.chdir(ROOT)
    with socketserver.TCPServer(("", PORT), CleanUrlHandler) as httpd:
        print(f"Serving {ROOT}")
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
