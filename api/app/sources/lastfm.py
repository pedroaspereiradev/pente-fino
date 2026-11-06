"""Busca de contexto na API do Last.fm: resumo editorial e tags.

Precisa de uma LASTFM_API_KEY (gratuita, ver last.fm/api/account/create).
Se a chave nao estiver configurada, essa fonte e simplesmente pulada -
nao trava o resto da busca.
"""

from __future__ import annotations

import os
import re

import requests

from app.schemas import Source
from app.sources.common import USER_AGENT

BASE_URL = "https://ws.audioscrobbler.com/2.0/"

_TAG_RE = re.compile(r"<[^>]+>")


def _strip_html(text: str) -> str:
    return _TAG_RE.sub("", text).strip()


def search_lastfm(artist: str, album: str) -> Source | None:
    api_key = os.environ.get("LASTFM_API_KEY")
    if not api_key:
        return None

    resp = requests.get(
        BASE_URL,
        params={
            "method": "album.getinfo",
            "api_key": api_key,
            "artist": artist,
            "album": album,
            "format": "json",
        },
        headers={"User-Agent": USER_AGENT},
        timeout=15,
    )
    resp.raise_for_status()
    data = resp.json()

    info = data.get("album")
    if not info or "error" in data:
        return None

    tags = [t["name"] for t in (info.get("tags", {}).get("tag") or [])]
    wiki_summary = _strip_html((info.get("wiki") or {}).get("summary") or "")

    parts = []
    if tags:
        parts.append(f"Tags: {', '.join(tags)}.")
    if wiki_summary:
        parts.append(wiki_summary)

    extract = " ".join(parts).strip()
    if not extract:
        return None

    return Source(
        type="lastfm",
        title=f"{info.get('name', album)} (Last.fm)",
        url=info.get("url", f"https://www.last.fm/music/{artist}/{album}"),
        extract=extract,
    )
