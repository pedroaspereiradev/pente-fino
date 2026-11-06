import { Suspense } from "react";
import Link from "next/link";
import { FichaExample } from "@/components/FichaExample";
import { FichaCardSkeleton } from "@/components/FichaCardSkeleton";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center px-6 py-16 sm:py-24">
      <header className="flex flex-col items-center text-center">
        <p className="font-logo text-2xl tracking-widest text-brand-pink">
          pente.fino
        </p>
        <h1 className="mt-8 max-w-md text-3xl leading-tight sm:text-4xl">
          <span className="font-light">Descubra discos que</span>{" "}
          <span className="font-bold text-brand-cream">ainda não conhece.</span>
        </h1>
        <p className="mt-4 max-w-sm text-sm font-light opacity-70">
          Conecte seu Spotify ou diga o que você curte. A gente garimpa
          álbuns e EPs fora do seu radar, com a história por trás de cada um
          que vai te fazer apertar o play.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-brand-cream transition-opacity hover:opacity-80"
          >
            Conectar com Spotify
          </button>
          <Link
            href="/gostos"
            className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-brand-cream transition-colors hover:bg-white/5"
          >
            Falar o que eu curto
          </Link>
        </div>
      </header>

      <section className="mt-20 flex w-full flex-col items-center">
        <p className="text-xs font-semibold uppercase tracking-widest opacity-50">
          Exemplo de ficha · dados ao vivo da Deezer
        </p>
        <div className="mt-6">
          <Suspense fallback={<FichaCardSkeleton />}>
            <FichaExample />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
