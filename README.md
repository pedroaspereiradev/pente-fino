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

**Sem perfil de gosto nem Spotify ainda - o resto do pipeline já funciona
de ponta a ponta com um disco de exemplo real.**

- `scripts/fetch_album.py` - script da Fase 0 que validou a ideia: dado
  artista + álbum, busca capa/faixas/prévia na Deezer e extrai a paleta
  de cores da capa. Veja `scripts/README.md`.
- `api/` - back-end em FastAPI:
  - `GET /albums/search` busca capa/faixas/prévia **ao vivo** na Deezer
    (nunca guarda a prévia, que expira).
  - `GET /albums/facts` busca contexto real na Wikipedia (pt+en),
    MusicBrainz e Last.fm.
  - `GET /albums/story` gera o gancho e a história a partir **só**
    dessas fontes (Gemini), valida que toda citação veio da busca de
    verdade, e verifica cada frase gerada contra o texto coletado antes
    de aceitar - descarta em vez de inventar.
  - `POST /taste-profile` recebe o perfil "digitar artistas" e confirma
    o recebimento (ainda sem embeddings/pgvector pra cruzar com discos).
  - Veja `api/README.md`.
- `web/` - front-end em Next.js com o visual implementado pixel a pixel
  (ver seção Design). Tela de entrada unificada (Spotify inerte + chips
  de artistas + distância) e uma ficha de exemplo real (Arthur Verocai)
  puxando gancho/história/paleta ao vivo da API. "Por que pra você",
  "Ouvir o disco inteiro", "Já conheço/Não curti" e login com Spotify
  ainda são só visual, sem funcionalidade por trás.
- Ainda não existem: perfil de gosto de verdade (embeddings/pgvector),
  busca vetorial, OAuth do Spotify, e feedback persistido.

## Stack planejada

- Front: Next.js. Back: Python (FastAPI). Banco: Postgres com pgvector.
- Dados: MusicBrainz, Last.fm, Wikipedia. Deezer para capa e prévias.
  Spotify para login e links.

## Design

- Fonte da verdade: os mockups HTML que guiaram a implementação pixel a
  pixel (cores, raios, gradientes, medidas) não ficam mais no repo -
  foram só uma referência de passagem, já totalmente incorporada no
  código (`web/src/lib/designTokens.ts`, `web/src/components/`).
- Fundo quase preto (`#050507`) com um gradiente ambiente sutil nos tons
  da marca; cards com cantos bem arredondados (24-32px); o player sobe
  sobre a capa com um glow radial que muda por disco (extraído da paleta
  da capa); títulos misturando peso fino (300) e negrito (700); botões
  circulares escuros.
- Cada ficha "veste" o disco: o glow e a cor de destaque vêm da paleta
  extraída da capa do álbum (ou de valores calibrados à mão pros 3
  discos de exemplo).
- Paleta fixa da marca (entrada, logo, navegação): `#1A0F2E` `#3B1B4F`
  `#7A2E6F` `#D6598F` `#F4D7D4` `#FF6B6B`.
- Fontes: Manrope (interface, pesos 300/400/600/700) e Major Mono
  Display (logo "pente.fino").
- Mobile-first, na web: a partir de ~640px de largura o conteúdo ganha
  um painel com borda/sombra pra não ficar perdido no meio da tela;
  abaixo disso é a tela mobile "crua".

## Notas técnicas já validadas

- A API pública do Deezer retorna link de prévia de 30s. Os links de
  prévia expiram: buscar na hora, não guardar.
- Spotify em modo de desenvolvimento tem limite baixo de usuários:
  suficiente para o MVP, por isso a entrada sem login é importante.
- Discos menos famosos podem ter pouco contexto na Wikipedia: cobertura
  ainda precisa ser testada mais a fundo.
