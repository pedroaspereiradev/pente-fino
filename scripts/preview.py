"""
Pente Fino - Fase 0

Visualizador de debug: le os JSONs gerados por fetch_album.py em output/
e monta uma pagina HTML simples pra inspecionar capa, paleta extraida e
a previa da faixa porta de entrada.

NAO e o design final do produto (ver referencia "Signal" e paleta da marca
no README) - e so uma ferramenta pra validar visualmente o que o
fetch_album.py esta coletando.

Uso:
    python scripts/preview.py
"""

from __future__ import annotations

import json
import webbrowser
from pathlib import Path

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "output"
PREVIEW_FILE = OUTPUT_DIR / "preview.html"

CARD_TEMPLATE = """
<section class="card" style="--bg:{background}; --accent:{accent};">
  <img class="cover" src="{cover_url}" alt="Capa de {album}" />
  <div class="info">
    <h2>{album}</h2>
    <p class="artist">{artist}</p>
    <p class="meta">{genre} - {release_date}</p>
    <div class="palette">{swatches}</div>
    <div class="lead-track">
      <span class="label">Porta de entrada</span>
      <strong>{lead_title}</strong>
      {audio}
    </div>
    <p class="tracks-count">{tracks_count} faixas no album</p>
    <a class="source" href="{deezer_link}" target="_blank">Fonte: Deezer &#8599;</a>
  </div>
</section>
"""

SWATCH_TEMPLATE = '<span class="swatch" style="background:{hex}" title="{hex}"></span>'

PAGE_TEMPLATE = """<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="utf-8" />
<title>Pente Fino - preview (Fase 0)</title>
<style>
  * {{ box-sizing: border-box; }}
  body {{
    margin: 0;
    padding: 40px 24px;
    background: #1A0F2E;
    color: #F4D7D4;
    font-family: 'Manrope', system-ui, sans-serif;
  }}
  h1 {{ font-weight: 300; }}
  h1 strong {{ font-weight: 700; }}
  .disclaimer {{
    max-width: 640px;
    color: #D6598F;
    font-size: 14px;
    margin-bottom: 32px;
  }}
  .grid {{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }}
  .card {{
    background: var(--bg, #3B1B4F);
    border-radius: 28px;
    overflow: hidden;
    box-shadow: 0 0 40px -10px var(--accent, #7A2E6F);
  }}
  .cover {{ width: 100%; aspect-ratio: 1/1; object-fit: cover; display: block; }}
  .info {{ padding: 20px; }}
  .info h2 {{ margin: 0 0 4px; font-weight: 700; }}
  .artist {{ margin: 0; opacity: 0.85; }}
  .meta {{ margin: 4px 0 12px; font-size: 13px; opacity: 0.6; }}
  .palette {{ display: flex; gap: 6px; margin-bottom: 16px; }}
  .swatch {{ width: 24px; height: 24px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); }}
  .lead-track {{ margin-bottom: 12px; }}
  .lead-track .label {{ display: block; font-size: 12px; opacity: 0.6; }}
  .lead-track strong {{ color: var(--accent, #FF6B6B); }}
  audio {{ width: 100%; margin-top: 8px; }}
  .tracks-count {{ font-size: 13px; opacity: 0.6; }}
  .source {{ color: var(--accent, #FF6B6B); font-size: 13px; text-decoration: none; }}
  .source:hover {{ text-decoration: underline; }}
</style>
</head>
<body>
  <h1>pente.<strong>fino</strong> - preview</h1>
  <p class="disclaimer">
    Isto NAO e o design final do produto - e um visualizador de debug pra
    inspecionar o que o fetch_album.py (Fase 0) esta coletando: capa,
    paleta extraida e a previa de 30s da faixa porta de entrada.
    As previas expiram em poucas horas, entao rode fetch_album.py de novo
    se o audio nao tocar.
  </p>
  <div class="grid">
    {cards}
  </div>
</body>
</html>
"""


def build_card(data: dict) -> str:
    palette = data["palette"]
    swatches = "".join(SWATCH_TEMPLATE.format(hex=h) for h in palette["colors"])

    lead = data.get("lead_track")
    lead_title = lead["title"] if lead else "(sem previa disponivel)"
    audio = (
        f'<audio controls src="{lead["preview_url"]}"></audio>'
        if lead and lead.get("preview_url")
        else ""
    )

    return CARD_TEMPLATE.format(
        background=palette["background"],
        accent=palette["accent"],
        cover_url=data["cover_url"],
        album=data["album"],
        artist=data["artist"],
        genre=data.get("genre") or "-",
        release_date=data.get("release_date") or "-",
        swatches=swatches,
        lead_title=lead_title,
        audio=audio,
        tracks_count=len(data.get("tracks", [])),
        deezer_link=data["deezer_link"],
    )


def main() -> None:
    files = sorted(OUTPUT_DIR.glob("*.json"))
    if not files:
        print(f"Nenhum JSON encontrado em {OUTPUT_DIR}. Rode fetch_album.py --all primeiro.")
        return

    cards = []
    for path in files:
        data = json.loads(path.read_text(encoding="utf-8"))
        cards.append(build_card(data))

    html = PAGE_TEMPLATE.format(cards="\n".join(cards))
    PREVIEW_FILE.write_text(html, encoding="utf-8")

    print(f"Preview gerado em: {PREVIEW_FILE}")
    webbrowser.open(PREVIEW_FILE.resolve().as_uri())


if __name__ == "__main__":
    main()
