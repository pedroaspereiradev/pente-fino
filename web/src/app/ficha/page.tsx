import { fetchStory, searchAlbum } from "@/lib/api";
import { exampleAlbum } from "@/data/example-album";
import { FichaCard } from "@/components/FichaCard";

export default async function FichaPage() {
  let data = null;
  let story = null;

  try {
    [data, story] = await Promise.all([
      searchAlbum(exampleAlbum.artist, exampleAlbum.album),
      fetchStory(exampleAlbum.artist, exampleAlbum.album),
    ]);
  } catch {
    data = null;
    story = null;
  }

  if (!data || !story) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center text-sm opacity-60">
        Não consegui buscar a ficha agora. A API (FastAPI) está rodando em{" "}
        <code className="opacity-80">localhost:8000</code>?
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center">
      <FichaCard data={data} story={story} index={1} total={1} />
    </div>
  );
}
