import Image from "next/image";
import Link from "next/link";
import type { AlbumResult } from "@/types/album";
import type { StoryResult } from "@/types/story";
import { getFichaTokens } from "@/lib/designTokens";
import { BackIcon, MoreIcon } from "./icons";
import { Player } from "./Player";
import { HistoriaDisclosure } from "./HistoriaDisclosure";

function formatDuration(totalSeconds: number): string {
  const min = Math.round(totalSeconds / 60);
  return `${min} min`;
}

export function FichaCard({
  data,
  story,
  index,
  total,
}: {
  data: AlbumResult;
  story: StoryResult;
  index: number;
  total: number;
}) {
  const tokens = getFichaTokens(data.artist, data.album, data.palette);
  const totalSeconds = data.tracks.reduce((sum, t) => sum + t.duration, 0);
  const country = story.facts.country ?? "-";
  const year = story.facts.release_year ?? "-";

  return (
    <div
      className="sm:my-10 sm:rounded-[32px] sm:border sm:border-line sm:bg-surface sm:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]"
      style={{
        width: "100%",
        maxWidth: 390,
        boxSizing: "border-box",
        padding: 20,
        color: "#F4F4F6",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link
          href="/"
          aria-label="Voltar"
          style={{
            width: 44,
            height: 44,
            borderRadius: 999,
            background: "#16161C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#F4F4F6",
          }}
        >
          <BackIcon />
        </Link>
        <div style={{ fontSize: 14, color: "#A8A8B3" }}>
          Ficha {index} de {total}
        </div>
        <button
          type="button"
          aria-label="Mais opções"
          style={{
            width: 44,
            height: 44,
            border: 0,
            borderRadius: 999,
            background: "#16161C",
            color: "#F4F4F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MoreIcon />
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            height: 330,
            borderRadius: 32,
            background: `radial-gradient(80% 80% at 50% 35%, ${tokens.coverGlowLight} 0%, ${tokens.coverGlowDark} 100%)`,
            border: "1px solid rgba(255,255,255,0.06)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Image
            src={data.cover_url}
            alt={`Capa de ${data.album}`}
            fill
            priority
            style={{ objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(to bottom, transparent 55%, ${tokens.coverGlowDark} 96%)`,
            }}
          />
        </div>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            margin: "-64px 12px 0",
            borderRadius: 28,
            padding: 18,
            background: `radial-gradient(140% 120% at 50% -10%, ${tokens.playerGlowStops[0]} 0%, ${tokens.playerGlowStops[1]} 55%, ${tokens.playerGlowStops[2]} 100%)`,
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {data.lead_track?.preview_url ? (
            <Player
              src={data.lead_track.preview_url}
              title={data.lead_track.title}
              deezerLink={data.deezer_link}
              accent={tokens.accent}
              onAccent={tokens.onAccent}
            />
          ) : (
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", margin: 0 }}>
              Prévia não disponível pra essa faixa agora.
            </p>
          )}
        </div>
      </div>

      {story.gancho ? (
        <h1
          style={{
            margin: 0,
            fontSize: 26,
            lineHeight: 1.25,
            fontWeight: 300,
            letterSpacing: -0.5,
          }}
        >
          {story.gancho}
        </h1>
      ) : (
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: "#A8A8B3", fontStyle: "italic" }}>
          Não encontrei (e verifiquei) um fato fundamentado o suficiente pra
          esse disco ainda — sem fonte, sem fato.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontSize: 16, fontWeight: 600 }}>{data.album}</div>
        <div style={{ fontSize: 14, color: "#A8A8B3" }}>
          {data.artist} · {country} · {year} · {formatDuration(totalSeconds)}
        </div>
      </div>

      <div
        style={{
          padding: 18,
          borderRadius: 24,
          background: "#111116",
          border: "1px solid #1E1E26",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            fontSize: 12,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: tokens.accent,
            fontWeight: 700,
          }}
        >
          Por que pra você
        </div>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55 }}>
          Exemplo ilustrativo — na versão real, essa frase conecta o disco ao
          seu perfil de gosto (gêneros, tags e artistas em comum), que ainda
          não existe.
        </p>
      </div>

      <HistoriaDisclosure
        historia={story.historia}
        fontes={story.facts.sources}
        motivo={story.motivo}
      />

      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
        <button
          type="button"
          style={{
            height: 56,
            border: 0,
            borderRadius: 999,
            background: tokens.accent,
            color: tokens.onAccent,
            fontFamily: "var(--font-manrope), sans-serif",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Ouvir o disco inteiro
        </button>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
          <button
            type="button"
            style={{
              height: 48,
              border: 0,
              borderRadius: 999,
              background: "#16161C",
              color: "#F4F4F6",
              fontFamily: "var(--font-manrope), sans-serif",
              fontSize: 14,
            }}
          >
            Já conheço
          </button>
          <button
            type="button"
            style={{
              height: 48,
              border: 0,
              borderRadius: 999,
              background: "#16161C",
              color: "#F4F4F6",
              fontFamily: "var(--font-manrope), sans-serif",
              fontSize: 14,
            }}
          >
            Não curti
          </button>
        </div>
        <Link
          href="/"
          style={{ textAlign: "center", fontSize: 14, padding: 8, color: "#F4F4F6" }}
        >
          ← Voltar pro início
        </Link>
      </div>
    </div>
  );
}

