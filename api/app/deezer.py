"""Busca de albuns na API publica do Deezer.

Mesma logica validada em scripts/fetch_album.py (Fase 0), adaptada pra
responder a uma requisicao HTTP em vez de salvar em arquivo.
"""

from __future__ import annotations

import io

import requests
from PIL import Image

from app.palette import extract_palette
from app.schemas import AlbumResult, Track

DEEZER_API = "https://api.deezer.com"


class AlbumNotFoundError(Exception):
    pass


def search_album(artist: str, album: str) -> dict:
    query = f'artist:"{artist}" album:"{album}"'
    resp = requests.get(f"{DEEZER_API}/search/album", params={"q": query}, timeout=15)
    resp.raise_for_status()
    results = resp.json().get("data", [])

    if not results:
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


def pick_lead_track(tracks: list[Track]) -> Track | None:
    candidates = [t for t in tracks if t.preview_url]
    if not candidates:
        return None
    return max(candidates, key=lambda t: t.rank)


def download_image(url: str) -> Image.Image:
    resp = requests.get(url, timeout=15)
    resp.raise_for_status()
    return Image.open(io.BytesIO(resp.content)).convert("RGB")


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
