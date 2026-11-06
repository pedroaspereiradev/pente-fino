"""
Pente Fino - Fase 0

Recebe artista + album, busca na API do Deezer (capa, faixas e preview da
faixa "porta de entrada"), extrai a paleta de cores dominante da capa e
salva tudo em um JSON.

Uso:
    python fetch_album.py "Arthur Verocai" "Arthur Verocai"
    python fetch_album.py --all          # roda os 3 casos de teste do CLAUDE.md

Nenhum dado é inventado: tudo que vai pro JSON vem direto da resposta da
API do Deezer ou é calculado deterministicamente a partir da capa (cores).
"""

from __future__ import annotations

import argparse
import io
import json
import sys
import unicodedata
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Optional

import numpy as np
import requests
from PIL import Image

DEEZER_API = "https://api.deezer.com"
OUTPUT_DIR = Path(__file__).resolve().parent.parent / "output"

# Casos de teste citados no CLAUDE.md (Fase 0).
TEST_CASES = [
    ("Arthur Verocai", "Arthur Verocai"),
    ("Little Simz", "Sometimes I Might Be Introvert"),
    ("Sampa the Great", "The Return"),
]


class AlbumNotFoundError(Exception):
    pass


@dataclass
class Palette:
    colors: list[str]       # 4-5 cores dominantes, em hex, por frequencia
    background: str         # cor escura de fundo
    accent: str              # cor de destaque com bom contraste contra o fundo


@dataclass
class Track:
    id: int
    title: str
    duration: int
    rank: int
    preview_url: Optional[str]


@dataclass
class AlbumResult:
    artist: str
    album: str
    release_date: Optional[str]
    genre: Optional[str]
    cover_url: str
    deezer_link: str
    tracks: list[Track]
    lead_track: Optional[Track]   # faixa "porta de entrada" (maior rank/popularidade)
    palette: Palette
    source: str = "Deezer API"


def _slugify(text: str) -> str:
    normalized = unicodedata.normalize("NFKD", text)
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
    slug = "".join(c if c.isalnum() else "-" for c in ascii_text.lower())
    while "--" in slug:
        slug = slug.replace("--", "-")
    return slug.strip("-")


def search_album(artist: str, album: str) -> dict:
    """Busca o album na API do Deezer e retorna o melhor resultado."""
    query = f'artist:"{artist}" album:"{album}"'
    resp = requests.get(f"{DEEZER_API}/search/album", params={"q": query}, timeout=15)
    resp.raise_for_status()
    data = resp.json()
    results = data.get("data", [])

    if not results:
        # fallback: busca mais livre, sem os filtros de campo
        resp = requests.get(
            f"{DEEZER_API}/search/album", params={"q": f"{artist} {album}"}, timeout=15
        )
        resp.raise_for_status()
        results = resp.json().get("data", [])

    if not results:
        raise AlbumNotFoundError(f"Nenhum album encontrado para {artist} - {album}")

    return results[0]


def get_album_details(album_id: int) -> dict:
    resp = requests.get(f"{DEEZER_API}/album/{album_id}", timeout=15)
    resp.raise_for_status()
    return resp.json()


def pick_lead_track(tracks: list[Track]) -> Optional[Track]:
    """Escolhe a faixa 'porta de entrada': a mais popular (maior rank do Deezer)
    entre as que tem preview disponivel."""
    candidates = [t for t in tracks if t.preview_url]
    if not candidates:
        return None
    return max(candidates, key=lambda t: t.rank)


def download_image(url: str) -> Image.Image:
    resp = requests.get(url, timeout=15)
    resp.raise_for_status()
    return Image.open(io.BytesIO(resp.content)).convert("RGB")


def _relative_luminance(rgb: tuple[int, int, int]) -> float:
    """Luminancia relativa (WCAG), usada pra escolher fundo escuro e contraste."""

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
    """Extrai as cores dominantes da capa via quantizacao (median cut),
    depois escolhe um fundo escuro e um destaque com bom contraste.
    """
    thumb = image.copy()
    thumb.thumbnail((200, 200))

    # quantiza pra um numero generoso de cores e pega as mais frequentes
    quantized = thumb.quantize(colors=max(16, n_colors * 3), method=Image.MEDIANCUT)
    palette_raw = quantized.getpalette()
    color_counts = quantized.getcolors()  # [(count, palette_index), ...]
    color_counts.sort(key=lambda c: c[0], reverse=True)

    def palette_index_to_rgb(idx: int) -> tuple[int, int, int]:
        return tuple(palette_raw[idx * 3: idx * 3 + 3])

    ranked = [palette_index_to_rgb(idx) for _, idx in color_counts]

    # remove cores quase identicas entre si pra nao repetir tons
    distinct: list[tuple[int, int, int]] = []
    for rgb in ranked:
        if all(np.linalg.norm(np.array(rgb) - np.array(d)) > 20 for d in distinct):
            distinct.append(rgb)
        if len(distinct) >= n_colors:
            break

    # se a imagem for pouco variada, completa com o que sobrou
    if len(distinct) < n_colors:
        for rgb in ranked:
            if rgb not in distinct:
                distinct.append(rgb)
            if len(distinct) >= n_colors:
                break

    colors_hex = [_rgb_to_hex(c) for c in distinct]

    # fundo: a cor dominante mais escura (entre as 'distinct'; se nenhuma for
    # escura o suficiente, escurece a mais escura disponivel)
    darkest = min(distinct, key=_relative_luminance)
    if _relative_luminance(darkest) > 0.08:
        darkest = tuple(int(c * 0.35) for c in darkest)
    background_hex = _rgb_to_hex(darkest)

    # destaque: entre as demais cores, a que tem maior contraste contra o
    # fundo e, em empate, mais saturada (pra nao cair num cinza sem graca)
    others = [c for c in distinct if c != darkest] or distinct
    accent = max(others, key=lambda c: (round(_contrast_ratio(c, darkest), 1), _saturation(c)))
    accent_hex = _rgb_to_hex(accent)

    return Palette(colors=colors_hex, background=background_hex, accent=accent_hex)


def fetch_album(artist: str, album: str) -> AlbumResult:
    search_hit = search_album(artist, album)
    details = get_album_details(search_hit["id"])

    tracks_data = details.get("tracks", {}).get("data", [])
    tracks = [
        Track(
            id=t["id"],
            title=t["title"],
            duration=t.get("duration", 0),
            rank=t.get("rank", 0),
            preview_url=t.get("preview") or None,
        )
        for t in tracks_data
    ]
    lead_track = pick_lead_track(tracks)

    cover_url = details.get("cover_xl") or details.get("cover_big") or details["cover"]
    image = download_image(cover_url)
    palette = extract_palette(image)

    return AlbumResult(
        artist=details["artist"]["name"],
        album=details["title"],
        release_date=details.get("release_date"),
        genre=(details.get("genres", {}).get("data") or [{}])[0].get("name"),
        cover_url=cover_url,
        deezer_link=details.get("link", search_hit.get("link")),
        tracks=tracks,
        lead_track=lead_track,
        palette=palette,
    )


def save_result(result: AlbumResult) -> Path:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{_slugify(result.artist)}__{_slugify(result.album)}.json"
    path = OUTPUT_DIR / filename
    with path.open("w", encoding="utf-8") as f:
        json.dump(asdict(result), f, ensure_ascii=False, indent=2)
    return path


def run_one(artist: str, album: str) -> None:
    print(f"-> buscando '{album}' de {artist} ...")
    try:
        result = fetch_album(artist, album)
    except AlbumNotFoundError as e:
        print(f"   [erro] {e}", file=sys.stderr)
        return
    except requests.RequestException as e:
        print(f"   [erro] falha de rede: {e}", file=sys.stderr)
        return

    path = save_result(result)
    lead = result.lead_track.title if result.lead_track else "(sem preview disponivel)"
    print(f"   ok: {result.artist} - {result.album}")
    print(f"   faixa porta de entrada: {lead}")
    print(f"   paleta: {result.palette.colors} (fundo {result.palette.background}, destaque {result.palette.accent})")
    print(f"   salvo em: {path}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("artist", nargs="?", help="Nome do artista")
    parser.add_argument("album", nargs="?", help="Nome do album")
    parser.add_argument(
        "--all", action="store_true", help="Roda os 3 casos de teste do CLAUDE.md"
    )
    args = parser.parse_args()

    if args.all:
        for artist, album in TEST_CASES:
            run_one(artist, album)
        return

    if not args.artist or not args.album:
        parser.error("informe artista e album, ou use --all")

    run_one(args.artist, args.album)


if __name__ == "__main__":
    main()
