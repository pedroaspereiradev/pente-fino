import type { AlbumResult } from "@/types/album";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8000";

export class AlbumNotFoundError extends Error {}

export async function searchAlbum(artist: string, album: string): Promise<AlbumResult> {
  const url = new URL("/albums/search", API_BASE_URL);
  url.searchParams.set("artist", artist);
  url.searchParams.set("album", album);

  // Previa expira em poucas horas, entao nunca cacheamos essa chamada.
  const res = await fetch(url, { cache: "no-store" });

  if (res.status === 404) {
    throw new AlbumNotFoundError(`Album nao encontrado: ${artist} - ${album}`);
  }
  if (!res.ok) {
    throw new Error(`Falha ao buscar album (${res.status})`);
  }

  return res.json();
}
