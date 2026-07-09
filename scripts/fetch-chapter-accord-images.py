#!/usr/bin/env python3
"""Download chapter accord facet images from Wikimedia Commons (CC BY / BY-SA)."""

import time
from io import BytesIO
from pathlib import Path
from urllib.request import Request, urlopen

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "images"
UA = "EillonSite/1.0 (https://eillon.maison; chapter accord imagery)"

# slug -> (base_url, hover_url) — direct upload.wikimedia.org URLs
SOURCES: dict[str, tuple[str, str]] = {
    "accord-asmara-rain": (
        "https://upload.wikimedia.org/wikipedia/commons/2/2f/Road_just_after_rain.JPG",
        "https://upload.wikimedia.org/wikipedia/commons/4/44/Drop_on_road.jpg",
    ),
    "accord-asmara-espresso": (
        "https://upload.wikimedia.org/wikipedia/commons/4/45/A_small_cup_of_coffee.JPG",
        "https://upload.wikimedia.org/wikipedia/commons/2/2c/Elettaria_cardamomum_Capsules_and_seeds.jpg",
    ),
    "accord-asmara-jasmine": (
        "https://upload.wikimedia.org/wikipedia/commons/3/3e/Jasminum_officinale_%282464481307%29.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/d/d9/Jasminum_sambac_kz01.jpg",
    ),
    "accord-asmara-amber": (
        "https://upload.wikimedia.org/wikipedia/commons/f/f7/Asmara_Montage.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/8/8b/Fes_-_Tanneries_-_6.jpg",
    ),
    "accord-massawa-citrus": (
        "https://upload.wikimedia.org/wikipedia/commons/e/e3/Oranges_-_whole-halved-segment.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/1/18/Carica_papaya_fruit.jpg",
    ),
    "accord-massawa-sea": (
        "https://upload.wikimedia.org/wikipedia/commons/3/39/Red_Sea_%288527947681%29.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/d/d5/Dead_Sea_salt.jpg",
    ),
    "accord-massawa-solar": (
        "https://upload.wikimedia.org/wikipedia/commons/d/d9/Adenium_obesum2.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/b/b0/OrangeBloss_wb.jpg",
    ),
    "accord-massawa-stone": (
        "https://upload.wikimedia.org/wikipedia/commons/d/d1/Limestone_Formation_In_Waitomo.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/8/88/Rock-cut_basin_forms.JPG",
    ),
    "accord-petricor-earth": (
        "https://upload.wikimedia.org/wikipedia/commons/7/77/Moist_soil_where_insects_builds_their_home.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/a/a4/Beautiful_road_view_after_heavy_rain.jpg",
    ),
    "accord-petricor-ozone": (
        "https://upload.wikimedia.org/wikipedia/commons/a/a7/Cumulonimbus_sunset_panorama%2C_Albury_NSW_Australia.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/9/9a/Rain_over_the_sea_-_Sochi.jpg",
    ),
    "accord-petricor-green": (
        "https://upload.wikimedia.org/wikipedia/commons/0/0d/Moss_on_stone.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/a/a6/Wet_leaves.jpg",
    ),
    "accord-petricor-limestone": (
        "https://upload.wikimedia.org/wikipedia/commons/8/8b/Fes_-_Tanneries_-_6.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/d/d1/Limestone_Formation_In_Waitomo.jpg",
    ),
    "accord-ritual-incense": (
        "https://upload.wikimedia.org/wikipedia/commons/7/7e/Frankinsence-oman-dhofar.JPG",
        "https://upload.wikimedia.org/wikipedia/commons/e/e8/Incense_stick.JPG",
    ),
    "accord-ritual-myrrh": (
        "https://upload.wikimedia.org/wikipedia/commons/2/26/Commiphora_myrrha.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/1/19/Aracena_-_Cistus_ladanifer_01.jpg",
    ),
    "accord-ritual-amber": (
        "https://upload.wikimedia.org/wikipedia/commons/1/10/A_piece_of_raw_Baltic_amber_2.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/a/ae/Candle_flame.jpg",
    ),
    "accord-ritual-woods": (
        "https://upload.wikimedia.org/wikipedia/commons/7/79/Santalum_album_4.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/1/17/Pogostemon_cablin_001.jpg",
    ),
}


def fetch(url: str) -> bytes:
    req = Request(url, headers={"User-Agent": UA})
    with urlopen(req, timeout=90) as res:
        return res.read()


def save_jpg(path: Path, data: bytes) -> None:
    img = Image.open(BytesIO(data)).convert("RGB")
    max_w = 900
    if img.width > max_w:
        ratio = max_w / img.width
        img = img.resize((max_w, max(1, round(img.height * ratio))), Image.Resampling.LANCZOS)
    img.save(path, "JPEG", quality=86, optimize=True, progressive=True)
    print(f"  wrote {path.name} ({path.stat().st_size // 1024} KB)")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for slug, (base_url, hover_url) in SOURCES.items():
        print(f"fetching {slug}...")
        save_jpg(OUT / f"{slug}.jpg", fetch(base_url))
        time.sleep(1.5)
        save_jpg(OUT / f"{slug}-hover.jpg", fetch(hover_url))
        time.sleep(1.5)
    print("done")


if __name__ == "__main__":
    main()
