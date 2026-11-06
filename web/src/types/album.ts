// Espelha o schema da API (api/app/schemas.py).

export type Track = {
  id: number;
  title: string;
  duration: number;
  rank: number;
  preview_url: string | null;
};

export type Palette = {
  colors: string[];
  background: string;
  accent: string;
};

export type AlbumResult = {
  artist: string;
  album: string;
  release_date: string | null;
  genre: string | null;
  cover_url: string;
  deezer_link: string;
  tracks: Track[];
  lead_track: Track | null;
  palette: Palette;
  source: string;
};
