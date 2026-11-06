import { FichaCard } from "@/components/FichaCard";
import { exampleFichas } from "@/data/example-fichas";

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
          Conecte seu Spotify ou diga de quem você gosta. A gente garimpa
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
          <button
            type="button"
            className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-brand-cream transition-colors hover:bg-white/5"
          >
            Apresentar meus gostos
          </button>
        </div>
      </header>

      <section className="mt-20 flex w-full flex-col items-center">
        <p className="text-xs font-semibold uppercase tracking-widest opacity-50">
          Exemplo de ficha · Fase 0
        </p>
        <div className="mt-6">
          <FichaCard ficha={exampleFichas[0]} />
        </div>
      </section>
    </div>
  );
}
