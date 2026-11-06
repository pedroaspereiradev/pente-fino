import Link from "next/link";
import { TasteForm } from "@/components/TasteForm";

export default function GostosPage() {
  return (
    <div className="flex flex-1 flex-col items-center px-6 py-16 sm:py-24">
      <Link
        href="/"
        className="self-start text-sm font-light opacity-60 hover:opacity-100"
      >
        ← voltar
      </Link>

      <header className="mt-8 flex flex-col items-center text-center">
        <h1 className="max-w-md text-3xl leading-tight sm:text-4xl">
          <span className="font-light">Apresenta pra gente</span>{" "}
          <span className="font-bold text-brand-cream">o que você curte.</span>
        </h1>
        <p className="mt-4 max-w-sm text-sm font-light opacity-70">
          Sem precisar conectar o Spotify. É só isso que a gente precisa pra
          começar o garimpo.
        </p>
      </header>

      <div className="mt-10">
        <TasteForm />
      </div>
    </div>
  );
}
