#!/usr/bin/env python3
"""Patch chapter pages and shared HTML for new flacon product photography."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

CHAPTERS = {
    "asmara": ("Asmara · Rain on Stone", "III"),
    "massawa": ("Massawa · Red Sea Citrus", "IV"),
    "petricor": ("Petricor · Earth After Rain", "V"),
    "oliva": ("Oliva · Olive Grove", "II"),
    "ritual": ("Ritual · Lab Archive", "Lab"),
}

HERO_BLOCK = """          <div class="chapter-hero__media chapter-hero__media--flacon">
            <picture>
              <source type="image/webp" srcset="images/flacon-{slug}-900.webp?v=1" />
              <img class="chapter-hero__flacon" src="images/flacon-{slug}.png?v=1" width="1122" height="1402" loading="eager" decoding="async" alt="EILLON flacon — {label}" />
            </picture>
          </div>"""

OBJECT_FIGURE = """        <figure><picture>
          <source type="image/webp" srcset="images/flacon-{slug}-900.webp?v=1" />
          <img src="images/flacon-{slug}.png?v=1" width="1122" height="1402" loading="lazy" decoding="async" alt="EILLON flacon — {label}" />
        </picture></figure>"""


def patch_chapter_page(path: Path, slug: str, label: str) -> None:
    html = path.read_text(encoding="utf-8")
    hero_pat = re.compile(
        r'<div class="chapter-hero__media">\s*(?:<picture>.*?</picture>\s*|<img class="chapter-hero__scene"[^>]+>\s*)'
        r'<img class="chapter-hero__bottle"[^>]+>\s*</div>',
        re.DOTALL,
    )
    html, n = hero_pat.subn(HERO_BLOCK.format(slug=slug, label=label), html, count=1)
    if n != 1:
        raise SystemExit(f"{path.name}: expected 1 hero block, replaced {n}")
    html = re.sub(
        r'<figure><img src="images/plain-bottle-with-logo\.webp" width="900" height="1125" loading="lazy" decoding="async" alt="EILLON bottle — [^"]+" /></figure>',
        OBJECT_FIGURE.format(slug=slug, label=label),
        html,
        count=1,
    )
    path.write_text(html, encoding="utf-8")
    print(f"patched {path.name}")


def main() -> None:
    for slug, (label, _chapter) in CHAPTERS.items():
        patch_chapter_page(ROOT / f"{slug}.html", slug, label)


if __name__ == "__main__":
    main()
