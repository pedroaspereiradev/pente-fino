# pente.fino

Web app que garimpa álbuns e EPs que você ainda não conhece. Você conecta
o Spotify ou informa artistas que já ama, e recebe discos fora do radar,
cada um com uma ficha: o gancho, a prévia da faixa porta de entrada, o
"por que pra você" e a história real por trás.

Projeto pessoal, em fase de validação (Fase 0). Objetivo: portfólio forte
em IA, com potencial de virar produto.

## Princípio central: a IA não inventa nada

- Todo fato de uma ficha vem de uma fonte real (Wikipedia, MusicBrainz,
  Last.fm, Discogs) e é citado.
- Fluxo RAG: busca primeiro, gera depois, verifica cada frase contra o
  texto coletado.
- Sem fonte, sem fato: se um disco não tem contexto suficiente, a ficha
  diz isso ou o disco sai da seleção.
- O "por que pra você" é a única parte interpretativa, e se apoia em
  dados concretos (gêneros, tags, artistas em comum).

## Fluxo do produto

1. Entrada A: login com Spotify (lê artistas e faixas mais ouvidos).
2. Entrada B: sem login, a pessoa digita de 3 a 5 artistas/discos e
   responde "perto do que ouve, no meio ou um salto?".
3. Perfil de gosto (embeddings de artistas, gêneros, tags).
4. Pente fino: busca vetorial com filtro de distância (nem perto demais,
   nem longe demais), exclui o que a pessoa já ouve.
5. Ficha de cada disco, com feedback "já conheço" / "não curti".

## A ficha

| Campo | O que traz | Fonte |
| --- | --- | --- |
| Gancho | O fato mais surpreendente das fontes, em uma frase, sem acrescentar nada | Fontes |
| Prévia | Play de 30s na faixa porta de entrada | API do Deezer |
| Por que pra você | A ponte entre o disco e o gosto da pessoa | Perfil + tags |
| Porta de entrada | A faixa para começar | Fontes ou popularidade |
| A história | Título, artista, país, ano, proposta e contexto | MusicBrainz + fontes |
| Fontes | Links de cada informação | Coletadas na busca |

## Status atual

**Fase 0 - validação técnica.** Ainda não existe interface (front-end).
O que existe hoje é um script Python (`scripts/fetch_album.py`) que valida
a primeira peça do pipeline: dado artista + álbum, busca capa/faixas/prévia
na Deezer e extrai a paleta de cores da capa. Veja `scripts/README.md`
para rodar.

## Stack planejada

- Front: Next.js. Back: Python (FastAPI). Banco: Postgres com pgvector.
- Dados: MusicBrainz, Last.fm, Wikipedia. Deezer para capa e prévias.
  Spotify para login e links.

## Design (referência pra quando o front existir)

- Referência de estilo: "Signal - Music Mobile App" (Behance). Fundo
  preto puro, cards com cantos bem arredondados (24-32px) e glow interno,
  player encaixado sob a capa, títulos misturando peso fino (300) e
  negrito (700), botões circulares escuros.
- Cada ficha "veste" o disco: o glow e a cor de destaque vêm da paleta
  extraída da capa do álbum.
- Paleta fixa da marca (entrada, logo, navegação): `#1A0F2E` `#3B1B4F`
  `#7A2E6F` `#D6598F` `#F4D7D4` `#FF6B6B`.
- Fontes: Manrope (interface) e Doto (logo "pente.fino", matriz de pontos).
- Mobile-first, na web.

## Notas técnicas já validadas

- A API pública do Deezer retorna link de prévia de 30s. Os links de
  prévia expiram: buscar na hora, não guardar.
- Spotify em modo de desenvolvimento tem limite baixo de usuários:
  suficiente para o MVP, por isso a entrada sem login é importante.
- Discos menos famosos podem ter pouco contexto na Wikipedia: cobertura
  ainda precisa ser testada mais a fundo.
