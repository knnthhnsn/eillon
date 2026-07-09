#!/usr/bin/env python3
"""Copy Eillon-flacon source PNGs into images/ and generate WebP display variants."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "images" / "Eillon-flacon"
OUT = ROOT / "images"

SLUGS = ("beles", "oliva", "asmara", "massawa", "petricor", "ritual", "ghost")
WIDTHS = (900, 1100)


def save_webp(im: Image.Image, path: Path, quality: int = 82) -> None:
    rgb = im.convert("RGB")
    rgb.save(path, "WEBP", quality=quality, method=6)


def resize_to_width(im: Image.Image, max_width: int) -> Image.Image:
    if im.width <= max_width:
        return im.copy()
    ratio = max_width / im.width
    size = (max_width, max(1, round(im.height * ratio)))
    return im.resize(size, Image.Resampling.LANCZOS)


def main() -> None:
    for slug in SLUGS:
        src = SRC / f"{slug}.png"
        if not src.is_file():
            raise SystemExit(f"missing source: {src}")
        im = Image.open(src)
        dest_png = OUT / f"flacon-{slug}.png"
        im.save(dest_png, optimize=True)
        print(f"OK {dest_png.name} ({dest_png.stat().st_size // 1024} KB)")
        for width in WIDTHS:
            sized = resize_to_width(im, width)
            webp = OUT / f"flacon-{slug}-{width}.webp"
            save_webp(sized, webp)
            print(f"   {webp.name} ({webp.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
