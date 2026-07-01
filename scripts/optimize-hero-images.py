#!/usr/bin/env python3
"""Generate responsive hero WebP/AVIF/JPEG variants for homepage LCP."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "images"
REPORT = ROOT / "artifacts" / "performance" / "hero-image-report.md"
WIDTHS = [480, 720, 960, 1100, 1200]
SOURCE_CANDIDATES = [
    IMAGES / "cowboy-cowgirl.jpg",
    IMAGES / "cowboy-cowgirl.png",
    IMAGES / "cowboy-cowgirl.webp",
    IMAGES / "cowboy-cowgirl-hi.webp",
]


def pick_source() -> Path:
    for path in SOURCE_CANDIDATES:
        if path.exists():
            return path
    raise SystemExit("No cowboy-cowgirl source image found in images/")


def resize_to_width(im: Image.Image, width: int) -> Image.Image:
    if im.width <= width:
        return im.copy()
    ratio = width / im.width
    height = max(1, round(im.height * ratio))
    return im.resize((width, height), Image.Resampling.LANCZOS)


def kb(path: Path) -> float:
    return path.stat().st_size / 1024


def save_webp(im: Image.Image, path: Path) -> None:
    rgb = im.convert("RGBA" if "A" in im.getbands() else "RGB")
    rgb.save(path, "WEBP", quality=82, method=6)


def save_jpeg(im: Image.Image, path: Path) -> None:
    im.convert("RGB").save(path, "JPEG", quality=82, optimize=True, progressive=True)


def save_avif(im: Image.Image, path: Path) -> bool:
    try:
        im.save(path, "AVIF", quality=60)
        return True
    except Exception:
        return False


def main() -> None:
    src = pick_source()
    lines = [
        "# Hero image variants",
        "",
        f"Source: `{src.name}` ({src.stat().st_size // 1024} KB on disk)",
        "",
        "| Width | WebP KB | AVIF KB | JPEG KB |",
        "|---:|---:|---:|---:|",
    ]

    with Image.open(src) as im:
        max_w = im.width
        for width in WIDTHS:
            if width > max_w and width != WIDTHS[-1]:
                continue
            sized = resize_to_width(im, min(width, max_w))
            stem = f"cowboy-cowgirl-{width if width <= max_w else max_w}"
            webp = IMAGES / f"{stem}.webp"
            save_webp(sized, webp)
            avif_kb = "—"
            avif_path = IMAGES / f"{stem}.avif"
            if save_avif(sized, avif_path):
                avif_kb = f"{kb(avif_path):.0f}"
            jpeg = IMAGES / f"{stem}.jpg"
            save_jpeg(sized, jpeg)
            lines.append(f"| {sized.width} | {kb(webp):.0f} | {avif_kb} | {kb(jpeg):.0f} |")
            print(f"OK {webp.name} ({kb(webp):.0f} KB)")

    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Report -> {REPORT}")


if __name__ == "__main__":
    main()
