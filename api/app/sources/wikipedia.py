"""Busca de contexto na Wikipedia (pt e en) sobre um album.

Procura primeiro por uma pagina dedicada ao album; se nao achar, cai pra
pagina do artista. Devolve o texto puro (sem markup) pra servir de base
pro gancho/historia - sem isso, nao ha fato pra contar.
"""

from __future__ import annotations

import requests

from app.schemas import Source
from app.sources.common import USER_AGENT

MAX_EXTRACT_CHARS = 4000


def _search_title(lang: str, artist: str, album: str) -> str | None:
    resp = requests.get(
        f"https://{lang}.wikipedia.org/w/api.php",
        params={
            "action": "query",
            "list": "search",
            "srsearch": f"{artist} {album} album",
            "format": "json",
        },
        headers={"User-Agent": USER_AGENT},
        timeout=15,
    )
    resp.raise_for_status()
    results = resp.json().get("query", {}).get("search", [])
    return results[0]["title"] if results else None


def _fetch_extract(lang: str, title: str) -> str | None:
    resp = requests.get(
        f"https://{lang}.wikipedia.org/w/api.php",
        params={
            "action": "query",
            "prop": "extracts",
            "explaintext": 1,
            "titles": title,
            "format": "json",
        },
        headers={"User-Agent": USER_AGENT},
        timeout=15,
    )
    resp.raise_for_status()
    pages = resp.json().get("query", {}).get("pages", {})
    page = next(iter(pages.values()), None)
    return page.get("extract") if page else None


def _page_url(lang: str, title: str) -> str:
    return f"https://{lang}.wikipedia.org/wiki/{title.replace(' ', '_')}"


def search_wikipedia(artist: str, album: str) -> list[Source]:
    sources: list[Source] = []
    seen_urls: set[str] = set()

    for lang in ("pt", "en"):
        title = _search_title(lang, artist, album)
        if not title:
            continue

        extract = _fetch_extract(lang, title)
        if not extract:
            continue

        url = _page_url(lang, title)
        if url in seen_urls:
            continue
        seen_urls.add(url)

        sources.append(
            Source(
                type="wikipedia",
                title=title,
                url=url,
                extract=extract[:MAX_EXTRACT_CHARS],
            )
        )

    return sources
