"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitTasteProfile } from "@/lib/api";
import type { Distancia } from "@/types/tasteProfile";
import { ArrowRightIcon } from "./icons";

const MIN_ITEMS = 3;
const MAX_ITEMS = 5;

const DISTANCIA_OPTIONS: { value: Distancia; label: string }[] = [
  { value: "perto", label: "Perto" },
  { value: "meio", label: "No meio" },
  { value: "salto", label: "Um salto" },
];

type Status = "idle" | "submitting" | "error";

export function EntradaForm() {
  const router = useRouter();
  const [items, setItems] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [distancia, setDistancia] = useState<Distancia>("meio");
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);

  function addFromDraft() {
    const value = draft.trim();
    if (!value || items.length >= MAX_ITEMS) return;
    setItems((prev) => [...prev, value]);
    setDraft("");
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function handleDraftKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addFromDraft();
    } else if (e.key === "Backspace" && draft === "" && items.length > 0) {
      removeItem(items.length - 1);
    }
  }

  async function handleSubmit() {
    const pending = draft.trim();
    const finalItems = pending ? [...items, pending] : items;

    if (finalItems.length < MIN_ITEMS) {
      setFormError(`Me conta pelo menos ${MIN_ITEMS} artistas ou discos.`);
      return;
    }

    setFormError(null);
    setStatus("submitting");
    try {
      await submitTasteProfile({ items: finalItems, distancia });
      router.push("/ficha");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: 16,
          borderRadius: 24,
          background: "#111116",
          border: "1px solid #1E1E26",
        }}
      >
        <label htmlFor="artistas" style={{ fontSize: 14, fontWeight: 600 }}>
          De 3 a 5 artistas ou discos que você ama
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              onClick={() => removeItem(index)}
              style={{
                padding: "7px 14px",
                borderRadius: 999,
                background: "#3B1B4F",
                fontSize: 14,
                cursor: "pointer",
              }}
              title="Clique pra remover"
            >
              {item}
            </span>
          ))}
          <input
            id="artistas"
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleDraftKeyDown}
            onBlur={addFromDraft}
            placeholder="Adicionar…"
            disabled={items.length >= MAX_ITEMS}
            style={{
              flexGrow: 1,
              minWidth: 100,
              height: 34,
              border: 0,
              background: "transparent",
              color: "#F4F4F6",
              fontFamily: "var(--font-manrope), sans-serif",
              fontSize: 14,
              outline: "none",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>
          Quer algo perto do que você ouve, ou um salto?
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
          {DISTANCIA_OPTIONS.map((option) => {
            const selected = distancia === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setDistancia(option.value)}
                style={{
                  height: 46,
                  borderRadius: 999,
                  border: selected ? "2px solid #FF6B6B" : "1px solid #1E1E26",
                  background: selected ? "#1A0F2E" : "#111116",
                  color: "#F4F4F6",
                  fontFamily: "var(--font-manrope), sans-serif",
                  fontSize: 14,
                  fontWeight: selected ? 700 : 400,
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {formError && (
        <p style={{ margin: 0, fontSize: 13, color: "#FF6B6B" }}>{formError}</p>
      )}
      {status === "error" && (
        <p style={{ margin: 0, fontSize: 13, color: "#FF6B6B" }}>
          Não consegui enviar agora. A API está rodando em localhost:8000?
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={status === "submitting"}
        style={{
          marginTop: "auto",
          height: 56,
          border: 0,
          borderRadius: 999,
          background: "#F4F4F6",
          color: "#050507",
          fontFamily: "var(--font-manrope), sans-serif",
          fontSize: 16,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          cursor: "pointer",
          opacity: status === "submitting" ? 0.6 : 1,
        }}
      >
        {status === "submitting" ? "Garimpando…" : "Passar o pente fino"}
        <ArrowRightIcon />
      </button>
    </>
  );
}
