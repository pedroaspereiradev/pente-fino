// Tokens de cor por disco, exatamente como em design-ref/DESIGN.md.
// Esses 3 foram calibrados a mao pelos mockups de referencia - nao sao
// re-derivados da paleta extraida automaticamente (fetch_album.py) pra
// nao perder fidelidade ao design-ref. Discos fora dessa lista usam
// getFallbackTokens, que deriva algo razoavel da paleta real (menos
// preciso, mas e o unico dado que temos pra um disco novo).

export type FichaColorTokens = {
  coverGlowLight: string;
  coverGlowDark: string;
  playerGlowStops: [string, string, string];
  accent: string;
  onAccent: string;
};

const KNOWN_TOKENS: Record<string, FichaColorTokens> = {
  "arthur verocai|arthur verocai": {
    coverGlowLight: "#3A3415",
    coverGlowDark: "#0E0F0A",
    playerGlowStops: ["#8A7224", "#2A2A12", "#121209"],
    accent: "#F2C14E",
    onAccent: "#0E0F0A",
  },
  "little simz|sometimes i might be introvert": {
    coverGlowLight: "#3A1612",
    coverGlowDark: "#0F0807",
    playerGlowStops: ["#8E3326", "#2E110D", "#140807"],
    accent: "#F08A6E",
    onAccent: "#140807",
  },
  "sampa the great|the return": {
    coverGlowLight: "#12343A",
    coverGlowDark: "#060E10",
    playerGlowStops: ["#1F6A74", "#0F2D33", "#071517"],
    accent: "#F2A65E",
    onAccent: "#071517",
  },
};

function key(artist: string, album: string): string {
  return `${artist.toLowerCase()}|${album.toLowerCase()}`;
}

function darken(hex: string, factor: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * factor);
  const g = Math.round(((n >> 8) & 255) * factor);
  const b = Math.round((n & 255) * factor);
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

function getFallbackTokens(background: string, accent: string): FichaColorTokens {
  return {
    coverGlowLight: darken(accent, 0.45),
    coverGlowDark: darken(background, 0.3),
    playerGlowStops: [darken(accent, 0.55), darken(accent, 0.2), darken(background, 0.3)],
    accent,
    onAccent: darken(background, 0.25),
  };
}

export function getFichaTokens(
  artist: string,
  album: string,
  fallback: { background: string; accent: string }
): FichaColorTokens {
  return KNOWN_TOKENS[key(artist, album)] ?? getFallbackTokens(fallback.background, fallback.accent);
}
