#!/usr/bin/env python3
"""Download chapter gallery imagery from Wikimedia Commons (CC BY / BY-SA)."""

import time
from io import BytesIO
from pathlib import Path
from urllib.request import Request, urlopen

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "images"
UA = "EillonSite/1.0 (https://eillon.maison; chapter gallery imagery)"

# slug -> direct upload.wikimedia.org URL
SOURCES: dict[str, str] = {
    # Asmara — rain, city stone, café air
    "gallery-asmara-rain": "https://upload.wikimedia.org/wikipedia/commons/a/a4/Beautiful_road_view_after_heavy_rain.jpg",
    "gallery-asmara-stone": "https://upload.wikimedia.org/wikipedia/commons/8/8b/Fes_-_Tanneries_-_6.jpg",
    "gallery-asmara-city": "https://upload.wikimedia.org/wikipedia/commons/f/f7/Asmara_Montage.jpg",
    # Massawa — Red Sea, citrus, solar bloom
    "gallery-massawa-sea": "https://upload.wikimedia.org/wikipedia/commons/3/39/Red_Sea_%288527947681%29.jpg",
    "gallery-massawa-citrus": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Oranges_-_whole-halved-segment.jpg",
    "gallery-massawa-bloom": "https://upload.wikimedia.org/wikipedia/commons/b/b0/OrangeBloss_wb.jpg",
    # Petricor — wet earth, moss stone, charged air
    "gallery-petricor-earth": "https://upload.wikimedia.org/wikipedia/commons/7/77/Moist_soil_where_insects_builds_their_home.jpg",
    "gallery-petricor-moss": "https://upload.wikimedia.org/wikipedia/commons/0/0d/Moss_on_stone.jpg",
    "gallery-petricor-storm": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Rain_over_the_sea_-_Sochi.jpg",
    # Ritual — incense, smoke, resin
    "gallery-ritual-incense": "https://upload.wikimedia.org/wikipedia/commons/7/7e/Frankinsence-oman-dhofar.JPG",
    "gallery-ritual-smoke": "https://upload.wikimedia.org/wikipedia/commons/e/e8/Incense_stick.JPG",
    "gallery-ritual-resin": "https://upload.wikimedia.org/wikipedia/commons/2/26/Commiphora_myrrha.jpg",
}


def fetch(url: str) -> bytes:
    req = Request(url, headers={"User-Agent": UA})
    with urlopen(req, timeout=90) as res:
        return res.read()


def save_jpg(path: Path, data: bytes) -> None:
    img = Image.open(BytesIO(data)).convert("RGB")
    max_w = 1200
    if img.width > max_w:
        ratio = max_w / img.width
        img = img.resize((max_w, max(1, round(img.height * ratio))), Image.Resampling.LANCZOS)
    img.save(path, "JPEG", quality=86, optimize=True, progressive=True)
    print(f"  wrote {path.name} ({path.stat().st_size // 1024} KB)")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for slug, url in SOURCES.items():
        print(f"fetching {slug}...")
        save_jpg(OUT / f"{slug}.jpg", fetch(url))
        time.sleep(1.5)
    print("done")


if __name__ == "__main__":
    main()
