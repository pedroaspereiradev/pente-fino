import { searchAlbum } from "@/lib/api";
import { exampleFichas } from "@/data/example-fichas";
import type { AlbumResult } from "@/types/album";
import { FichaCard } from "./FichaCard";

export async function FichaExample() {
  const editorial = exampleFichas[0];

  let data: AlbumResult | null = null;
  try {
    data = await searchAlbum(editorial.artist, editorial.album);
  } catch {
    data = null;
  }

  if (!data) {
    return (
      <div className="w-full max-w-sm rounded-[28px] border border-white/10 p-6 text-center text-sm opacity-60">
        Não consegui buscar o exemplo agora. A API (FastAPI) está rodando em{" "}
        <code className="opacity-80">localhost:8000</code>?
      </div>
    );
  }

  return <FichaCard editorial={editorial} data={data} />;
}
