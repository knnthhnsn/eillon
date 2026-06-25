#!/usr/bin/env python3
"""Generate display-sized WebP/JPEG variants for site images."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "images"

# (filename, max_width, webp_q, jpeg_q, replace_original)
JOBS: list[tuple[str, int, int, int | None, bool]] = [
    ("desert-architecture-hero.jpg", 1200, 82, 82, True),
    ("about-origin.jpg", 1400, 82, 82, True),
    ("about-place.jpg", 1400, 82, 82, True),
    ("about-studio.jpg", 1400, 82, 80, True),
    ("cactus-hero.jpg", 900, 82, 82, True),
    ("cactus-craft.jpg", 900, 82, 82, True),
    ("cactus-mood.jpg", 1200, 82, 82, True),
    ("scent-asmara.jpg", 1200, 82, 82, True),
    ("scent-massawa.jpg", 1200, 82, 82, True),
    ("scent-ritual.jpg", 1200, 82, 82, True),
    ("asmara-hero.jpg", 900, 82, 82, True),
    ("cactus-shop.jpg", 900, 82, 82, True),
    ("beles-concept.png", 1100, 82, None, False),
    ("red-sea.png", 900, 82, None, False),
    ("model-woman.png", 1200, 82, None, False),
    ("beles-luxury.png", 1254, 82, None, False),
    ("beles-mood.png", 1122, 82, None, False),
    ("beles-splash.png", 900, 82, None, False),
    ("plain-bottle-with-logo.png", 1024, 82, None, False),
    ("accord-fruit.jpg", 550, 80, 82, False),
    ("accord-fruit-hover.jpg", 550, 80, 82, False),
    ("accord-green.jpg", 550, 80, 82, False),
    ("accord-green-hover.jpg", 550, 80, 82, False),
    ("accord-bloom.jpg", 550, 80, 82, False),
    ("accord-bloom-hover.jpg", 550, 80, 82, False),
    ("accord-warmth.jpg", 550, 80, 82, False),
    ("accord-warmth-hover.jpg", 550, 80, 82, False),
]


def resize_to_width(im: Image.Image, max_width: int) -> Image.Image:
    if im.width <= max_width:
        return im.copy()
    ratio = max_width / im.width
    size = (max_width, max(1, round(im.height * ratio)))
    return im.resize(size, Image.Resampling.LANCZOS)


def save_webp(im: Image.Image, path: Path, quality: int) -> None:
    if im.mode not in ("RGB", "RGBA"):
        im = im.convert("RGBA" if "A" in im.getbands() else "RGB")
    im.save(path, "WEBP", quality=quality, method=6)


def save_jpeg(im: Image.Image, path: Path, quality: int) -> None:
    rgb = im.convert("RGB")
    rgb.save(path, "JPEG", quality=quality, optimize=True, progressive=True)


def stem_width_name(path: Path, width: int, ext: str) -> Path:
    return path.with_name(f"{path.stem}-{width}{ext}")


def kb(path: Path) -> float:
    return path.stat().st_size / 1024


def process(name: str, max_width: int, webp_q: int, jpeg_q: int | None, replace: bool) -> None:
    src = ROOT / name
    if not src.exists():
        print(f"SKIP missing {name}")
        return

    with Image.open(src) as im:
        sized = resize_to_width(im, max_width)
        webp_out = stem_width_name(src, max_width, ".webp")
        save_webp(sized, webp_out, webp_q)

        if jpeg_q is not None and src.suffix.lower() in {".jpg", ".jpeg"}:
            jpg_out = stem_width_name(src, max_width, ".jpg")
            save_jpeg(sized, jpg_out, jpeg_q)
            if replace:
                save_jpeg(sized, src, jpeg_q)
            print(f"OK {name} -> {webp_out.name} ({kb(webp_out):.0f} KB), {jpg_out.name} ({kb(jpg_out):.0f} KB)" + (" [replaced]" if replace else ""))
        else:
            print(f"OK {name} -> {webp_out.name} ({kb(webp_out):.0f} KB)")
            jpg_fallback = stem_width_name(src, max_width, ".jpg")
            save_jpeg(sized, jpg_fallback, 82)
            print(f"   fallback {jpg_fallback.name} ({kb(jpg_fallback):.0f} KB)")

        if name == "desert-architecture-hero.jpg":
            for w in (900, 1200):
                alias = ROOT / f"desert-architecture-{w}.webp"
                save_webp(resize_to_width(im, w), alias, webp_q)
                print(f"   alias {alias.name} ({kb(alias):.0f} KB)")


def main() -> None:
    for job in JOBS:
        process(*job)


if __name__ == "__main__":
    main()
