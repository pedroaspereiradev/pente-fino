# pente.fino API

Back-end em FastAPI. Busca tudo ao vivo (capa, prévia, fontes reais) e
gera o gancho/história a partir só do que foi encontrado - nunca guarda
nada, nunca inventa fato.

## Setup

Usa o mesmo `.venv` da raiz do projeto (compartilhado com `scripts/`):

```
python -m venv .venv
.venv/Scripts/pip install -r api/requirements.txt   # Windows
```

Copie `api/.env.example` pra `api/.env` e preencha:

```
GEMINI_API_KEY=...   # grátis em aistudio.google.com/apikey
GEMINI_MODEL=gemini-3.1-flash-lite
LASTFM_API_KEY=...   # grátis em last.fm/api/account/create (opcional)
```

Sem `LASTFM_API_KEY`, essa fonte é só pulada - a busca continua com
Wikipedia + MusicBrainz.

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
- `GET /albums/facts?artist=...&album=...` — busca contexto real na
  Wikipedia (pt+en), MusicBrainz e Last.fm. Retorna `insuficiente: true`
  se nenhuma fonte achar nada.
- `GET /albums/story?artist=...&album=...` — usa `facts` acima pra gerar
  o gancho e a história (Gemini): valida que a fonte citada veio da
  busca de verdade, e verifica cada frase gerada contra o texto
  coletado antes de aceitar. O que não passa na verificação é
  descartado (`historia`/`gancho` voltam `null`), nunca é "aproximado".
- `POST /taste-profile` — recebe `{ items: string[3-5], distancia }` e
  confirma o recebimento. Ainda não há perfil de gosto (embeddings/
  pgvector) nem recomendação de verdade - é só validação por enquanto.

## Front-end

O Next.js (`web/`) consome essa API via `src/lib/api.ts`, usando a env
var `NEXT_PUBLIC_API_BASE_URL` (ver `web/.env.example`). Os fetches de
`/albums/search` e `/albums/story` são sempre `no-store` — a prévia
nunca é cacheada, igual às notas técnicas do README raiz.
