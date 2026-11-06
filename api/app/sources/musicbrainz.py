"""Busca de dados estruturados na MusicBrainz: titulo, tipo, ano e pais.

A API publica pede no maximo 1 requisicao por segundo pra uso anonimo e
um User-Agent descritivo - por isso o pequeno rate limit abaixo.
"""

from __future__ import annotations

import time

import requests

from app.schemas import Source
from app.sources.common import USER_AGENT

BASE_URL = "https://musicbrainz.org/ws/2"
MIN_INTERVAL_SECONDS = 1.0

# A MusicBrainz devolve nome de pais em ingles (ou so o codigo ISO) - como
# a ficha e em portugues, traduz os paises mais comuns. Pais fora dessa
# lista cai pro nome em ingles mesmo (melhor que o codigo ISO cru).
_COUNTRY_NAMES_PT = {
    "Brazil": "Brasil",
    "United Kingdom": "Reino Unido",
    "United States": "Estados Unidos",
    "Australia": "Austrália",
    "Portugal": "Portugal",
    "Spain": "Espanha",
    "France": "França",
    "Germany": "Alemanha",
    "Italy": "Itália",
    "Japan": "Japão",
    "Canada": "Canadá",
    "Argentina": "Argentina",
    "Mexico": "México",
    "Jamaica": "Jamaica",
    "Nigeria": "Nigéria",
    "South Africa": "África do Sul",
}

_last_call_at = 0.0


def _rate_limited_get(url: str, params: dict) -> requests.Response:
    global _last_call_at
    elapsed = time.monotonic() - _last_call_at
    if elapsed < MIN_INTERVAL_SECONDS:
        time.sleep(MIN_INTERVAL_SECONDS - elapsed)

    resp = requests.get(
        url, params=params, headers={"User-Agent": USER_AGENT}, timeout=15
    )
    _last_call_at = time.monotonic()
    resp.raise_for_status()
    return resp


class MusicBrainzFacts:
    def __init__(
        self,
        title: str,
        album_type: str | None,
        release_year: str | None,
        country: str | None,
        tags: list[str],
        source: Source,
    ):
        self.title = title
        self.album_type = album_type
        self.release_year = release_year
        self.country = country
        self.tags = tags
        self.source = source


def search_musicbrainz(artist: str, album: str) -> MusicBrainzFacts | None:
    resp = _rate_limited_get(
        f"{BASE_URL}/release-group/",
        params={
            "query": f'artist:"{artist}" AND releasegroup:"{album}"',
            "fmt": "json",
        },
    )
    groups = resp.json().get("release-groups", [])
    if not groups:
        return None

    group = groups[0]
    tags = [t["name"] for t in group.get("tags", [])]
    release_year = (group.get("first-release-date") or "")[:4] or None

    country = None
    artist_credit = group.get("artist-credit") or []
    if artist_credit:
        artist_id = artist_credit[0].get("artist", {}).get("id")
        if artist_id:
            artist_resp = _rate_limited_get(f"{BASE_URL}/artist/{artist_id}", params={"fmt": "json"})
            artist_data = artist_resp.json()
            area_name = (artist_data.get("area") or {}).get("name")
            country = _COUNTRY_NAMES_PT.get(area_name, area_name) if area_name else artist_data.get("country")

    url = f"https://musicbrainz.org/release-group/{group['id']}"

    return MusicBrainzFacts(
        title=group["title"],
        album_type=group.get("primary-type"),
        release_year=release_year,
        country=country,
        tags=tags,
        source=Source(
            type="musicbrainz",
            title=f"{group['title']} (MusicBrainz)",
            url=url,
            extract=(
                f"Tipo: {group.get('primary-type') or '-'}. "
                f"Lancamento: {release_year or '-'}. Pais do artista: {country or '-'}. "
                f"Tags: {', '.join(tags) or '-'}."
            ),
        ),
    )
