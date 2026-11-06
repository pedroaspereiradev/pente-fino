"use client";

import { useState } from "react";
import type { Source } from "@/types/story";
import { ChevronRightIcon } from "./icons";

export function HistoriaDisclosure({
  historia,
  fontes,
  motivo,
}: {
  historia: string | null;
  fontes: Source[];
  motivo: string | null;
}) {
  const [open, setOpen] = useState(false);

  if (!historia) {
    return (
      <div
        style={{
          padding: "14px 18px",
          borderRadius: 999,
          background: "#111116",
          border: "1px solid #1E1E26",
          fontSize: 14,
          color: "#A8A8B3",
        }}
      >
        Ainda não tenho uma história verificada pra contar sobre esse disco.
      </div>
    );
  }

  return (
    <div
      style={{
        borderRadius: open ? 24 : 999,
        background: "#111116",
        border: "1px solid #1E1E26",
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          background: "transparent",
          border: 0,
          color: "#F4F4F6",
          fontFamily: "var(--font-manrope), sans-serif",
          fontSize: 14,
          cursor: "pointer",
        }}
      >
        A história e as fontes
        <span style={{ transform: open ? "rotate(90deg)" : "none", display: "flex" }}>
          <ChevronRightIcon />
        </span>
      </button>
      {open && (
        <div style={{ padding: "0 18px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: "#F4F4F6" }}>{historia}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {fontes.map((f) => (
              <a
                key={f.url}
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 12, color: "#A8A8B3" }}
              >
                {f.title} ↗
              </a>
            ))}
          </div>
          {motivo && (
            <p style={{ margin: 0, fontSize: 12, color: "#A8A8B3", fontStyle: "italic" }}>
              {motivo}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
