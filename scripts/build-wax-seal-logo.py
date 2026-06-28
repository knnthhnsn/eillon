"""Build wax-seal-logo.webp from the real winged emblem in images/logo.png."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
LOGO = ROOT / "images" / "logo.png"
OUT = ROOT / "images" / "letters" / "wax-seal-logo.webp"

# Include full wing + tail; wordmark ends before ~32% of logo.png width
EMBLEM_CROP_LEFT = 0.32


def extract_emblem(logo: Image.Image) -> Image.Image:
    w, _h = logo.size
    emblem = logo.crop((int(w * EMBLEM_CROP_LEFT), 0, w, logo.size[1]))
    return emblem.crop(emblem.getbbox())


def make_wax_base(size: int) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    cx, cy = size // 2, size // 2

    shadow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.ellipse((cx - 248, cy - 146, cx + 248, cy + 186), fill=(40, 20, 16, 62))
    canvas = Image.alpha_composite(canvas, shadow.filter(ImageFilter.GaussianBlur(7)))

    for i in range(250, 0, -1):
        t = i / 250
        draw.ellipse(
            (cx - i, cy - int(i * 0.69), cx + i, cy + int(i * 0.69)),
            fill=(int(132 + 32 * t), int(54 + 24 * t), int(46 + 20 * t), 255),
        )

    highlight = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    hdraw = ImageDraw.Draw(highlight)
    hdraw.ellipse((cx - 118, cy - 92, cx + 82, cy + 12), fill=(255, 245, 235, 52))
    canvas = Image.alpha_composite(canvas, highlight.filter(ImageFilter.GaussianBlur(9)))
    draw.ellipse((cx - 250, cy - 172, cx + 250, cy + 172), outline=(255, 240, 230, 54), width=2)
    return canvas


def press_emblem(wax: Image.Image, emblem: Image.Image) -> Image.Image:
    """Stamp the real logo artwork onto wax — exact line art, no reinterpretation."""
    size = wax.size[0]
    em = emblem.copy()
    max_side = int(size * 0.64)
    em.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)

    result = wax.copy()
    x0 = (size - em.width) // 2
    y0 = (size - em.height) // 2 - 2

    alpha = em.split()[3]

    # Soft contact shadow
    shadow = Image.new("RGBA", em.size, (28, 10, 8, 0))
    shadow.putalpha(alpha.point(lambda a: int(a * 0.28)))
    result.alpha_composite(shadow, (x0 + 2, y0 + 2))

    # Real logo ink — near-black from source alpha, unchanged geometry
    ink = Image.new("RGBA", em.size, (18, 8, 6, 255))
    ink.putalpha(alpha)
    result.alpha_composite(ink, (x0, y0))

    # Faint upper-left catch light on wax rim only (not on ink)
    rim = Image.new("RGBA", em.size, (0, 0, 0, 0))
    rim_arr = np.array(rim)
    alpha_arr = np.array(alpha).astype(float) / 255.0
    for y in range(1, em.height):
        for x in range(1, em.width):
            if alpha_arr[y, x] > 0.2 and alpha_arr[y - 1, x - 1] < 0.08:
                rim_arr[y, x, 3] = min(255, int(70 * alpha_arr[y, x]))
    rim = Image.fromarray(rim_arr)
    result.alpha_composite(rim, (x0 - 1, y0 - 1))

    return result


def trim_transparent(img: Image.Image, pad: int = 10) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    x0, y0, x1, y1 = bbox
    return img.crop((max(0, x0 - pad), max(0, y0 - pad), x1 + pad, y1 + pad))


def main() -> None:
    logo = Image.open(LOGO).convert("RGBA")
    emblem = extract_emblem(logo)
    wax = make_wax_base(640)
    seal = press_emblem(wax, emblem)
    seal = trim_transparent(seal)

    max_w = 380
    if seal.width > max_w:
        ratio = max_w / seal.width
        seal = seal.resize(
            (max_w, max(1, int(seal.height * ratio))),
            Image.Resampling.LANCZOS,
        )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    seal.save(OUT, "WEBP", quality=92, method=6)
    print(f"Wrote {OUT} ({seal.size[0]}x{seal.size[1]}) from {LOGO.name}")


if __name__ == "__main__":
    main()
