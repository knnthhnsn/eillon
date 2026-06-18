#!/usr/bin/env python3
"""Download and optimize Maison palette images from Wikimedia Commons."""

from io import BytesIO
from pathlib import Path
from urllib.request import Request, urlopen

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "images"
UA = "EillonSite/1.0 (https://eillon.maison; palette imagery)"

SOURCES = [
    {
        "slug": "palette-desert-fruit",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Figues_de_barbarie_Tunisie.JPG/1280px-Figues_de_barbarie_Tunisie.JPG",
        "credit": "Habib M'henni / Wikimedia Commons (CC BY-SA 3.0)",
    },
    {
        "slug": "palette-rain-stone",
        "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Fes_-_Tanneries_-_6.jpg/1280px-Fes_-_Tanneries_-_6.jpg",
        "credit": "Zil / Wikimedia Commons (CC BY-SA 3.0)",
    },
    {
        "slug": "palette-red-sea-citrus",
        "url": "https://upload.wikimedia.org/wikipedia/commons/3/39/Red_Sea_%288527947681%29.jpg",
        "credit": "David Stanley / Wikimedia Commons (CC BY 2.0)",
    },
    {
        "slug": "palette-sacred-resin",
        "url": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Frankinsence-oman-dhofar.JPG",
        "credit": "Photohound / Wikimedia Commons (Public domain)",
    },
]


def fetch(url: str) -> bytes:
    req = Request(url, headers={"User-Agent": UA})
    with urlopen(req, timeout=60) as res:
        return res.read()


def save_pair(slug: str, data: bytes) -> None:
    img = Image.open(BytesIO(data)).convert("RGB")
    max_w = 1200
    if img.width > max_w:
        ratio = max_w / img.width
        img = img.resize((max_w, round(img.height * ratio)), Image.Resampling.LANCZOS)

    jpg_path = OUT / f"{slug}.jpg"
    webp_path = OUT / f"{slug}.webp"
    img.save(jpg_path, "JPEG", quality=86, optimize=True, progressive=True)
    img.save(webp_path, "WEBP", quality=82, method=6)
    print(f"wrote {jpg_path.name} ({jpg_path.stat().st_size // 1024} KB)")
    print(f"wrote {webp_path.name} ({webp_path.stat().st_size // 1024} KB)")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for item in SOURCES:
        print(f"fetching {item['slug']}...")
        data = fetch(item["url"])
        save_pair(item["slug"], data)
    print("done")


if __name__ == "__main__":
    main()
