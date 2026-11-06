import type { AlbumResult } from "@/types/album";
import type { TasteProfileRequest, TasteProfileResponse } from "@/types/tasteProfile";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

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

export async function submitTasteProfile(
  payload: TasteProfileRequest
): Promise<TasteProfileResponse> {
  const res = await fetch(new URL("/taste-profile", API_BASE_URL), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Falha ao enviar perfil de gosto (${res.status})`);
  }

  return res.json();
}
