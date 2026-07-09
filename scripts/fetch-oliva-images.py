#!/usr/bin/env python3
"""Download Oliva chapter imagery from Wikimedia Commons (CC BY / BY-SA)."""

import time
from io import BytesIO
from pathlib import Path
from urllib.request import Request, urlopen

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "images"
UA = "EillonSite/1.0 (https://eillon.maison; oliva chapter imagery)"

SINGLE = {
    "scent-oliva": "https://upload.wikimedia.org/wikipedia/commons/2/26/Olive_grove.jpg",
    "palette-olive-grove": "https://upload.wikimedia.org/wikipedia/commons/2/26/Olive_grove.jpg",
    "gallery-oliva-grove": "https://upload.wikimedia.org/wikipedia/commons/9/94/Olive_tree.jpg",
    "gallery-oliva-fruit": "https://upload.wikimedia.org/wikipedia/commons/b/b7/Olives.jpg",
    "gallery-oliva-oil": "https://upload.wikimedia.org/wikipedia/commons/9/97/Olive_oil.jpg",
}

PAIRS = {
    "accord-oliva-leaf": (
        "https://upload.wikimedia.org/wikipedia/commons/3/30/Olive_leaves.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/7/7e/Olea_europaea.jpg",
    ),
    "accord-oliva-fruit": (
        "https://upload.wikimedia.org/wikipedia/commons/b/b7/Olives.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/5/51/Green_olives.jpg",
    ),
    "accord-oliva-oil": (
        "https://upload.wikimedia.org/wikipedia/commons/9/97/Olive_oil.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/c/c0/Olive_harvest.jpg",
    ),
    "accord-oliva-grove": (
        "https://upload.wikimedia.org/wikipedia/commons/2/26/Olive_grove.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/9/94/Olive_tree.jpg",
    ),
}


def fetch(url: str) -> bytes:
    req = Request(url, headers={"User-Agent": UA})
    with urlopen(req, timeout=90) as res:
        return res.read()


def save_jpg(path: Path, data: bytes, max_w: int = 1200) -> None:
    img = Image.open(BytesIO(data)).convert("RGB")
    if img.width > max_w:
        ratio = max_w / img.width
        img = img.resize((max_w, max(1, round(img.height * ratio))), Image.Resampling.LANCZOS)
    img.save(path, "JPEG", quality=86, optimize=True, progressive=True)
    print(f"  wrote {path.name} ({path.stat().st_size // 1024} KB)")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for slug, url in SINGLE.items():
        print(f"fetching {slug}...")
        save_jpg(OUT / f"{slug}.jpg", fetch(url))
        time.sleep(1.5)
    for slug, (base, hover) in PAIRS.items():
        print(f"fetching {slug}...")
        save_jpg(OUT / f"{slug}.jpg", fetch(base), 900)
        time.sleep(1.5)
        save_jpg(OUT / f"{slug}-hover.jpg", fetch(hover), 900)
        time.sleep(1.5)
    print("done")


if __name__ == "__main__":
    main()
