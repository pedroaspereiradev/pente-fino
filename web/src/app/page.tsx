import { EntradaForm } from "@/components/EntradaForm";
import { Logo } from "@/components/Logo";

export default function Home() {
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
        gap: 22,
        flex: 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Logo />
        <a
          href="#"
          className="hover:text-brand-coral!"
          style={{ fontSize: 13, color: "#F4D7D4" }}
        >
          Como funciona
        </a>
      </div>

      <div
        style={{
          borderRadius: 32,
          padding: "28px 24px",
          background:
            "radial-gradient(90% 80% at 50% 0%, #7A2E6F 0%, #3B1B4F 45%, #120A1C 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 36, lineHeight: 1.1, fontWeight: 300, letterSpacing: -1 }}>
          Garimpando <span style={{ fontWeight: 700 }}>o disco certo</span> pra você
        </h1>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: "rgba(255,255,255,0.78)" }}>
          Discos que você ainda não conhece, cada um com a história real por
          trás.
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "rgba(255,255,255,0.78)",
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: 999, background: "#FF6B6B" }} />
          Sem chute, para valer a pena o seu play!
        </div>
      </div>

      <button
        type="button"
        style={{
          height: 56,
          border: 0,
          borderRadius: 999,
          background: "#FF6B6B",
          color: "#1A0F2E",
          fontFamily: "var(--font-manrope), sans-serif",
          fontSize: 16,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Entrar com Spotify
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#A8A8B3", fontSize: 13 }}>
        <div style={{ flexGrow: 1, height: 1, background: "#1E1E26" }} />
        <span>ou conte pra gente</span>
        <div style={{ flexGrow: 1, height: 1, background: "#1E1E26" }} />
      </div>

      <EntradaForm />
    </div>
  );
}
