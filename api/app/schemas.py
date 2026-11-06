from pydantic import BaseModel


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
