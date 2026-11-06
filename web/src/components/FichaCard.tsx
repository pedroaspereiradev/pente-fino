import Image from "next/image";
import type { FichaExemplo } from "@/data/example-fichas";
import { PreviewPlayer } from "./PreviewPlayer";

export function FichaCard({ ficha }: { ficha: FichaExemplo }) {
  const { palette } = ficha;

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
          src={ficha.coverUrl}
          alt={`Capa de ${ficha.album}`}
          width={500}
          height={500}
          priority
          className="aspect-square w-full object-cover"
        />
        <div className="absolute inset-x-2 bottom-2">
          <PreviewPlayer src={ficha.leadTrack.previewUrl} title={ficha.leadTrack.title} />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2" style={{ color: palette.accent }}>
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        <p className="text-xs font-semibold uppercase tracking-wide">o gancho</p>
      </div>
      <p className="mt-1 text-lg font-light leading-snug text-brand-cream">
        {ficha.gancho}
      </p>
      <p className="mt-1 text-xs font-light opacity-50">Fonte: {ficha.ganchoFonte}</p>

      <div className="mt-5 border-t border-white/10 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-60">
          por que pra você
        </p>
        <p className="mt-1 text-sm font-light leading-relaxed opacity-80">
          {ficha.porQuePraVoce}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm">
        <div>
          <p className="font-light opacity-70">{ficha.artist}</p>
          <p className="font-bold text-brand-cream">{ficha.album}</p>
        </div>
        <div className="text-right text-xs font-light opacity-50">
          <p>{ficha.genre}</p>
          <p>{ficha.releaseDate}</p>
        </div>
      </div>

      <a
        href={ficha.deezerLink}
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
