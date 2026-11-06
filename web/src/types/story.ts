// Espelha o schema da API (api/app/schemas.py - AlbumFacts e StoryResult).

export type Source = {
  type: "wikipedia" | "musicbrainz" | "lastfm";
  title: string;
  url: string;
  extract: string;
};

export type AlbumFacts = {
  artist: string;
  album: string;
  country: string | null;
  release_year: string | null;
  album_type: string | null;
  tags: string[];
  sources: Source[];
  insuficiente: boolean;
  motivo: string | null;
};

export type StoryResult = {
  facts: AlbumFacts;
  gancho: string | null;
  gancho_fonte: string | null;
  historia: string | null;
  historia_fontes: string[];
  insuficiente: boolean;
  motivo: string | null;
};
