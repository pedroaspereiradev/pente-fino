"""Extracao da paleta de cores dominante de uma capa de album.

Mesma logica validada em scripts/fetch_album.py (Fase 0): quantizacao
median-cut pra achar as cores dominantes, depois escolhe um fundo escuro
e um destaque com bom contraste (WCAG) entre elas.
"""

from __future__ import annotations

import numpy as np
from PIL import Image

from app.schemas import Palette


def _relative_luminance(rgb: tuple[int, int, int]) -> float:
    def channel(c: int) -> float:
        c = c / 255.0
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4

    r, g, b = rgb
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)


def _contrast_ratio(rgb_a: tuple[int, int, int], rgb_b: tuple[int, int, int]) -> float:
    la = _relative_luminance(rgb_a) + 0.05
    lb = _relative_luminance(rgb_b) + 0.05
    return max(la, lb) / min(la, lb)


def _saturation(rgb: tuple[int, int, int]) -> float:
    r, g, b = (c / 255.0 for c in rgb)
    mx, mn = max(r, g, b), min(r, g, b)
    return 0.0 if mx == 0 else (mx - mn) / mx


def _rgb_to_hex(rgb: tuple[int, int, int]) -> str:
    return "#{:02X}{:02X}{:02X}".format(*rgb)


def extract_palette(image: Image.Image, n_colors: int = 5) -> Palette:
    thumb = image.copy()
    thumb.thumbnail((200, 200))

    quantized = thumb.quantize(colors=max(16, n_colors * 3), method=Image.MEDIANCUT)
    palette_raw = quantized.getpalette()
    color_counts = quantized.getcolors()
    color_counts.sort(key=lambda c: c[0], reverse=True)

    def palette_index_to_rgb(idx: int) -> tuple[int, int, int]:
        return tuple(palette_raw[idx * 3: idx * 3 + 3])

    ranked = [palette_index_to_rgb(idx) for _, idx in color_counts]

    distinct: list[tuple[int, int, int]] = []
    for rgb in ranked:
        if all(np.linalg.norm(np.array(rgb) - np.array(d)) > 20 for d in distinct):
            distinct.append(rgb)
        if len(distinct) >= n_colors:
            break

    if len(distinct) < n_colors:
        for rgb in ranked:
            if rgb not in distinct:
                distinct.append(rgb)
            if len(distinct) >= n_colors:
                break

    colors_hex = [_rgb_to_hex(c) for c in distinct]

    darkest = min(distinct, key=_relative_luminance)
    if _relative_luminance(darkest) > 0.08:
        darkest = tuple(int(c * 0.35) for c in darkest)
    background_hex = _rgb_to_hex(darkest)

    others = [c for c in distinct if c != darkest] or distinct
    accent = max(others, key=lambda c: (round(_contrast_ratio(c, darkest), 1), _saturation(c)))
    accent_hex = _rgb_to_hex(accent)

    return Palette(colors=colors_hex, background=background_hex, accent=accent_hex)
