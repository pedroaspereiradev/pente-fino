import Image from "next/image";
import type { FichaEditorial } from "@/data/example-fichas";
import type { AlbumResult } from "@/types/album";
import { PreviewPlayer } from "./PreviewPlayer";

export function FichaCard({
  editorial,
  data,
}: {
  editorial: FichaEditorial;
  data: AlbumResult;
}) {
  const { palette } = data;

  return (
    <article
      className="w-full max-w-sm overflow-hidden rounded-[28px] p-5 shadow-[0_0_70px_-20px_var(--ficha-accent)]"
      style={
        {
          background: palette.background,
          "--ficha-accent": palette.accent,
        } as React.CSSProperties
      }
    >
      <div className="relative overflow-hidden rounded-[20px]">
        <Image
          src={data.cover_url}
          alt={`Capa de ${data.album}`}
          width={500}
          height={500}
          priority
          className="aspect-square w-full object-cover"
        />
        {data.lead_track?.preview_url && (
          <div className="absolute inset-x-2 bottom-2">
            <PreviewPlayer
              src={data.lead_track.preview_url}
              title={data.lead_track.title}
            />
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center gap-2" style={{ color: palette.accent }}>
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        <p className="text-xs font-semibold uppercase tracking-wide">o gancho</p>
      </div>
      <p className="mt-1 text-lg font-light leading-snug text-brand-cream">
        {editorial.gancho}
      </p>
      <p className="mt-1 text-xs font-light opacity-50">Fonte: {editorial.ganchoFonte}</p>

      <div className="mt-5 border-t border-white/10 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-60">
          por que pra você
        </p>
        <p className="mt-1 text-sm font-light leading-relaxed opacity-80">
          {editorial.porQuePraVoce}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm">
        <div>
          <p className="font-light opacity-70">{data.artist}</p>
          <p className="font-bold text-brand-cream">{data.album}</p>
        </div>
        <div className="text-right text-xs font-light opacity-50">
          <p>{data.genre ?? "-"}</p>
          <p>{data.release_date ?? "-"}</p>
        </div>
      </div>

      <a
        href={data.deezer_link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-xs font-light underline-offset-2 hover:underline"
        style={{ color: palette.accent }}
      >
        Fonte: Deezer ↗
      </a>
    </article>
  );
}
