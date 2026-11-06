"use client";

import { useState } from "react";
import { submitTasteProfile } from "@/lib/api";
import type { Distancia } from "@/types/tasteProfile";

const MIN_ITEMS = 3;
const MAX_ITEMS = 5;

const DISTANCIA_OPTIONS: { value: Distancia; label: string }[] = [
  { value: "perto", label: "Perto do que eu ouço" },
  { value: "meio", label: "No meio do caminho" },
  { value: "salto", label: "Um salto" },
];

type Status = "idle" | "submitting" | "done" | "error";

export function TasteForm() {
  const [items, setItems] = useState<string[]>(["", "", ""]);
  const [distancia, setDistancia] = useState<Distancia | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  function updateItem(index: number, value: string) {
    setItems((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  function addItem() {
    if (items.length < MAX_ITEMS) setItems((prev) => [...prev, ""]);
  }

  function removeItem(index: number) {
    if (items.length > MIN_ITEMS) {
      setItems((prev) => prev.filter((_, i) => i !== index));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const filled = items.map((i) => i.trim()).filter(Boolean);
    if (filled.length < MIN_ITEMS) {
      setFormError(`Me conta pelo menos ${MIN_ITEMS} artistas ou discos.`);
      return;
    }
    if (!distancia) {
      setFormError("Escolhe o quão longe do que você já ouve você quer ir.");
      return;
    }

    setFormError(null);
    setStatus("submitting");
    try {
      await submitTasteProfile({ items: filled, distancia });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="w-full max-w-md rounded-[28px] bg-brand-plum p-6 text-center">
        <p className="font-bold text-brand-cream">Perfil recebido!</p>
        <p className="mt-2 text-sm font-light opacity-70">
          O garimpo de verdade (cruzar isso com um banco de discos) ainda tá
          em construção — por enquanto a gente só confirma que chegou
          certinho.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-[28px] bg-brand-plum p-6"
    >
      <p className="text-xs font-semibold uppercase tracking-widest opacity-60">
        De 3 a 5 artistas ou discos que você já curte
      </p>

      <div className="mt-4 flex flex-col gap-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={`Artista ou disco ${index + 1}`}
              className="w-full rounded-full bg-black/40 px-4 py-2 text-sm text-brand-cream placeholder:opacity-40 focus:outline-none focus:ring-1 focus:ring-brand-pink"
            />
            {items.length > MIN_ITEMS && (
              <button
                type="button"
                onClick={() => removeItem(index)}
                aria-label="Remover"
                className="shrink-0 text-xs opacity-50 hover:opacity-80"
              >
                remover
              </button>
            )}
          </div>
        ))}
      </div>

      {items.length < MAX_ITEMS && (
        <button
          type="button"
          onClick={addItem}
          className="mt-3 text-xs font-semibold text-brand-pink hover:opacity-80"
        >
          + adicionar outro
        </button>
      )}

      <p className="mt-6 text-xs font-semibold uppercase tracking-widest opacity-60">
        Quão longe do que você já ouve?
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {DISTANCIA_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setDistancia(option.value)}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              distancia === option.value
                ? "bg-brand-coral text-black font-semibold"
                : "bg-black/40 text-brand-cream hover:bg-black/60"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {formError && (
        <p className="mt-4 text-sm text-brand-coral">{formError}</p>
      )}
      {status === "error" && (
        <p className="mt-4 text-sm text-brand-coral">
          Não consegui enviar agora. A API está rodando em localhost:8000?
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 w-full rounded-full bg-black py-3 text-sm font-semibold text-brand-cream transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {status === "submitting" ? "Enviando..." : "Garimpar"}
      </button>
    </form>
  );
}
