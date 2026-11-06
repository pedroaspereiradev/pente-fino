# Fase 0 - fetch_album.py

Script de validação: recebe artista + álbum, busca na API pública do
Deezer e salva um JSON com capa, faixas, a faixa "porta de entrada"
(a mais popular com prévia disponível) e a paleta de cores extraída
da capa.

## Setup

```
python -m venv .venv
.venv/Scripts/pip install -r scripts/requirements.txt   # Windows
# source .venv/bin/activate && pip install -r scripts/requirements.txt  # Linux/Mac
```

## Uso

```
python scripts/fetch_album.py "Arthur Verocai" "Arthur Verocai"
python scripts/fetch_album.py --all   # roda os 3 casos de teste do CLAUDE.md
```

Os resultados vão para `output/<artista>__<album>.json`.

## Observações

- Os links de prévia (`preview_url`) da Deezer expiram em poucas horas.
  O JSON salvo é só pra inspeção/validação da Fase 0 — em produção a
  prévia deve ser buscada na hora, nunca guardada (ver CLAUDE.md).
- A paleta usa quantização median-cut (Pillow) nas cores da capa,
  depois escolhe a cor mais escura como fundo e, entre as demais, a
  de maior contraste (WCAG) como destaque.
