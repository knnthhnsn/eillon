#!/usr/bin/env python3
"""Add WebP picture sources for optimized image variants across HTML pages."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# img src -> webp srcset (insert picture wrapper if missing)
WEBP_MAP: dict[str, str] = {
    "images/about-origin.jpg": "images/about-origin-1400.webp",
    "images/about-place.jpg": "images/about-place-1400.webp",
    "images/about-studio.jpg": "images/about-studio-1400.webp",
    "images/beles-concept.png": "images/beles-concept-1100.webp",
    "/images/beles-concept.png": "images/beles-concept-1100.webp",
    "../images/beles-concept.png": "images/beles-concept-1100.webp",
    "images/model-woman.png": "images/model-woman-1200.webp",
    "images/scent-asmara.jpg": "images/scent-asmara-1200.webp",
    "images/scent-massawa.jpg": "images/scent-massawa-1200.webp",
    "images/scent-ritual.jpg": "images/scent-ritual-1200.webp",
    "images/cactus-craft.jpg": "images/cactus-craft-900.webp",
    "images/cactus-hero.jpg": "images/cactus-hero-900.webp",
    "images/cactus-mood.jpg": "images/cactus-mood-1200.webp",
    "/images/beles-mood.png": "images/beles-mood-1122.webp",
    "images/beles-mood.png": "images/beles-mood-1122.webp",
    "images/asmara-hero.jpg": "images/asmara-hero-900.webp",
    "images/cactus-shop.jpg": "images/cactus-shop-900.webp",
    "images/red-sea.png": "images/red-sea-900.webp",
    "images/desert-architecture-hero.jpg": "images/desert-architecture-900.webp",
}

# Upgrade existing webp srcset to sized variants
SRCSET_UPGRADES: dict[str, str] = {
    "images/beles-luxury.webp?v=1": "images/beles-luxury-1254.webp?v=2",
    "images/beles-luxury.webp": "images/beles-luxury-1254.webp?v=2",
    "images/beles-splash.webp": "images/beles-splash-900.webp?v=2",
}


def wrap_img_with_picture(html: str, src: str, webp: str) -> str:
    pattern = re.compile(
        rf'<img(?P<attrs>[^>]*\ssrc="{re.escape(src)}"[^>]*)(/?)>',
        re.IGNORECASE,
    )

    def repl(match: re.Match[str]) -> str:
        start = match.start()
        # Skip if already inside a picture element
        window = html[max(0, start - 400) : start]
        if "<picture>" in window and "</picture>" not in window.split("<picture>")[-1]:
            return match.group(0)
        attrs = match.group("attrs")
        closing = match.group(2) or ""
        tag = f"<img{attrs}{closing}>"
        return (
            f'<picture>\n          <source type="image/webp" srcset="{webp}" />\n          {tag}\n        </picture>'
        )

    return pattern.sub(repl, html)


def patch_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    original = text

    for src, webp in WEBP_MAP.items():
        text = wrap_img_with_picture(text, src, webp)

    for old, new in SRCSET_UPGRADES.items():
        text = text.replace(old, new)

    # Remove redundant second hero preload on homepage
    if path.name == "index.html":
        text = re.sub(
            r'\s*<link rel="preload" as="image" href="images/cowboy-cowgirl-hi\.webp" type="image/webp" />\n',
            "\n",
            text,
        )
        text = text.replace(
            '<source type="image/webp" srcset="images/beles-luxury.webp" />',
            '<source type="image/webp" srcset="images/beles-luxury-1254.webp?v=2" />',
        )

    if text != original:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main() -> None:
    changed = []
    for path in sorted(ROOT.rglob("*.html")):
        if patch_file(path):
            changed.append(path.relative_to(ROOT))
    print(f"Patched {len(changed)} files:")
    for p in changed:
        print(f"  {p}")


if __name__ == "__main__":
    main()
