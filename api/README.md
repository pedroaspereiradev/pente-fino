# pente.fino API

Back-end em FastAPI. Por enquanto, só a rota que resolve o problema da
prévia da Deezer expirar: busca tudo (capa, faixas, prévia, paleta de
cores) **ao vivo**, a cada requisição — nunca guarda nada.

## Setup

Usa o mesmo `.venv` da raiz do projeto (compartilhado com `scripts/`):

```
python -m venv .venv
.venv/Scripts/pip install -r api/requirements.txt   # Windows
```

## Rodar

```
cd api
../.venv/Scripts/python -m uvicorn app.main:app --port 8000 --reload
```

Docs interativas (Swagger) em http://localhost:8000/docs.

## Rotas

- `GET /health`
- `GET /albums/search?artist=...&album=...` — busca na Deezer e retorna
  capa, faixas, faixa porta de entrada (com prévia fresca) e a paleta de
  cores extraída da capa.

## Front-end

O Next.js (`web/`) consome essa API via `src/lib/api.ts`, usando a env
var `API_BASE_URL` (ver `web/.env.example`). O fetch é sempre
`no-store` — a prévia nunca é cacheada, igual às notas técnicas do
README raiz.
