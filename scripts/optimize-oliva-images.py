#!/usr/bin/env python3
"""Generate WebP/JPEG variants for Oliva chapter assets only."""

from __future__ import annotations

import importlib.util
from pathlib import Path

spec = importlib.util.spec_from_file_location(
    "optimize_images", Path(__file__).resolve().parent / "optimize-images.py"
)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

JOBS = [
    ("scent-oliva.jpg", 1200, 82, 82, True),
    ("palette-olive-grove.jpg", 1200, 82, 82, False),
    ("accord-oliva-leaf.jpg", 550, 80, 82, False),
    ("accord-oliva-leaf-hover.jpg", 550, 80, 82, False),
    ("accord-oliva-fruit.jpg", 550, 80, 82, False),
    ("accord-oliva-fruit-hover.jpg", 550, 80, 82, False),
    ("accord-oliva-oil.jpg", 550, 80, 82, False),
    ("accord-oliva-oil-hover.jpg", 550, 80, 82, False),
    ("accord-oliva-grove.jpg", 550, 80, 82, False),
    ("accord-oliva-grove-hover.jpg", 550, 80, 82, False),
    ("gallery-oliva-grove.jpg", 900, 82, 82, False),
    ("gallery-oliva-fruit.jpg", 900, 82, 82, False),
    ("gallery-oliva-oil.jpg", 900, 82, 82, False),
]

if __name__ == "__main__":
    for job in JOBS:
        mod.process(*job)
