"""Orquestra a busca (Wikipedia + MusicBrainz) antes de qualquer geracao.

Principio do produto: busca primeiro, gera depois. Se nao sobrar fonte
nenhuma, a ficha tem que admitir isso em vez de inventar.

Cada fonte e isolada: se a MusicBrainz ou a Wikipedia estiverem fora do
ar (ou devolverem 503, comum em uso mais pesado), a busca continua com
o que sobrou em vez de derrubar a ficha inteira.
"""

from __future__ import annotations

import logging

import requests

from app.schemas import AlbumFacts, Source
from app.sources.lastfm import search_lastfm
from app.sources.musicbrainz import MusicBrainzFacts, search_musicbrainz
from app.sources.wikipedia import search_wikipedia

logger = logging.getLogger(__name__)


def _safe_search_wikipedia(artist: str, album: str) -> list:
    try:
        return search_wikipedia(artist, album)
    except requests.RequestException:
        logger.warning("Wikipedia indisponivel pra %s - %s", artist, album, exc_info=True)
        return []


def _safe_search_musicbrainz(artist: str, album: str) -> MusicBrainzFacts | None:
    try:
        return search_musicbrainz(artist, album)
    except requests.RequestException:
        logger.warning("MusicBrainz indisponivel pra %s - %s", artist, album, exc_info=True)
        return None


def _safe_search_lastfm(artist: str, album: str) -> Source | None:
    try:
        return search_lastfm(artist, album)
    except requests.RequestException:
        logger.warning("Last.fm indisponivel pra %s - %s", artist, album, exc_info=True)
        return None


def collect_facts(artist: str, album: str) -> AlbumFacts:
    sources = list(_safe_search_wikipedia(artist, album))

    mb = _safe_search_musicbrainz(artist, album)
    if mb:
        sources.append(mb.source)

    lastfm_source = _safe_search_lastfm(artist, album)
    if lastfm_source:
        sources.append(lastfm_source)

    if not sources:
        return AlbumFacts(
            artist=artist,
            album=album,
            country=None,
            release_year=None,
            album_type=None,
            tags=[],
            sources=[],
            insuficiente=True,
            motivo="Nao encontrei contexto suficiente na Wikipedia, MusicBrainz nem Last.fm pra esse disco.",
        )

    tags = list(mb.tags) if mb else []

    return AlbumFacts(
        artist=artist,
        album=album,
        country=mb.country if mb else None,
        release_year=mb.release_year if mb else None,
        album_type=mb.album_type if mb else None,
        tags=tags,
        sources=sources,
        insuficiente=False,
    )
