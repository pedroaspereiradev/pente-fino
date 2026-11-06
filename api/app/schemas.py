from typing import Literal

from pydantic import BaseModel, Field


class Track(BaseModel):
    id: int
    title: str
    duration: int
    rank: int
    preview_url: str | None


class Palette(BaseModel):
    colors: list[str]
    background: str
    accent: str


class AlbumResult(BaseModel):
    artist: str
    album: str
    release_date: str | None
    genre: str | None
    cover_url: str
    deezer_link: str
    tracks: list[Track]
    lead_track: Track | None
    palette: Palette
    source: str = "Deezer API"


Distancia = Literal["perto", "meio", "salto"]


class TasteProfileRequest(BaseModel):
    items: list[str] = Field(min_length=3, max_length=5)
    distancia: Distancia


class TasteProfileResponse(BaseModel):
    status: str
    items: list[str]
    distancia: Distancia


class Source(BaseModel):
    type: Literal["wikipedia", "musicbrainz", "lastfm"]
    title: str
    url: str
    extract: str


class AlbumFacts(BaseModel):
    artist: str
    album: str
    country: str | None
    release_year: str | None
    album_type: str | None
    tags: list[str]
    sources: list[Source]
    insuficiente: bool
    motivo: str | None = None


class StoryResult(BaseModel):
    facts: AlbumFacts
    gancho: str | None
    gancho_fonte: str | None
    historia: str | None
    historia_fontes: list[str]
    insuficiente: bool
    motivo: str | None = None
