"""Gera o gancho e a historia do disco a partir das fontes coletadas.

Principio central do produto: busca primeiro, gera depois, verifica cada
frase contra o texto coletado. O modelo so pode citar uma fonte que
realmente veio da busca (nunca inventa URL), e cada frase gerada passa
por uma segunda chamada que confere se ela e sustentada pelo texto.
"""

from __future__ import annotations

import logging
import os

from google import genai
from google.genai import types
from pydantic import BaseModel

from app.schemas import AlbumFacts, StoryResult

logger = logging.getLogger(__name__)

# Evita que uma chamada travada ao Gemini prenda a requisicao pra sempre -
# depois disso, prefere responder "insuficiente" a nunca responder.
_REQUEST_TIMEOUT_MS = 30_000


def _get_client() -> genai.Client:
    # Um client novo por chamada: o FastAPI roda cada requisicao numa
    # thread do threadpool, e o client do SDK nao e seguro pra
    # compartilhar entre threads concorrentes.
    return genai.Client(api_key=os.environ["GEMINI_API_KEY"])


def _model_name() -> str:
    return os.environ.get("GEMINI_MODEL", "gemini-3.1-flash-lite")


class _StoryDraft(BaseModel):
    gancho: str
    gancho_fonte_url: str
    historia: str
    historia_fontes_urls: list[str]
    suficiente: bool


class _Verification(BaseModel):
    suportado: bool
    nota: str | None = None


def _sources_blob(facts: AlbumFacts) -> str:
    parts = []
    for s in facts.sources:
        parts.append(f"### Fonte: {s.url}\n{s.extract}")
    return "\n\n".join(parts)


def _draft_story(facts: AlbumFacts) -> _StoryDraft | None:
    prompt = f"""Voce e um pesquisador que escreve fichas sobre discos. Use
APENAS as informacoes presentes nos textos das fontes abaixo. Nao
acrescente nenhum fato, data, nome ou detalhe que nao esteja explicito
no texto. Se nao houver um fato realmente surpreendente nas fontes,
marque suficiente=false em vez de inventar ou exagerar.

Artista: {facts.artist}
Disco: {facts.album}

{_sources_blob(facts)}

Tarefas:
1. "gancho": o fato mais surpreendente das fontes, contado em UMA frase,
   sem acrescentar nada. Deve ser exatamente o tipo de frase que
   funciona como chamariz pra alguem querer ouvir o disco.
2. "gancho_fonte_url": a URL (das fontes acima) de onde esse fato vem.
3. "historia": um paragrafo curto (3-5 frases) com titulo, artista,
   pais, ano e a proposta/contexto do disco, baseado só nas fontes.
4. "historia_fontes_urls": lista das URLs (das fontes acima) usadas na
   historia.
5. "suficiente": false se as fontes nao derem pra montar um gancho
   realmente surpreendente e fundamentado; true caso contrario.
"""

    client = _get_client()
    try:
        response = client.models.generate_content(
            model=_model_name(),
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=_StoryDraft,
                http_options=types.HttpOptions(timeout=_REQUEST_TIMEOUT_MS),
            ),
        )
    except Exception:
        logger.warning("Gemini indisponivel ao gerar rascunho da historia", exc_info=True)
        return None
    return response.parsed


def _verify_claim(claim: str, facts: AlbumFacts) -> _Verification:
    prompt = f"""Confira se a afirmacao abaixo e fiel aos textos das
fontes - ou seja, se ela nao inventa nem contradiz nenhum fato, nome,
data ou numero.

Afirmacao: "{claim}"

Fontes:
{_sources_blob(facts)}

Seja razoavel, nao pedante: aprove (suportado=true) quando a afirmacao
e uma parafrase, resumo, ou combinacao de fatos que realmente estao
nas fontes (mesmo que em fontes diferentes, com outras palavras, ou
usando um termo equivalente - ex: "acronimo" por "backronym" esta ok).
Reprove (suportado=false) só quando houver um fato, numero, nome ou
data que nao aparece em nenhuma fonte, ou que contradiga o que as
fontes dizem. Na duvida entre pedantismo e razoabilidade, prefira
aprovar. Se reprovar, explique em "nota" qual fato especifico nao tem
base nenhuma nas fontes (nao aponte so uma diferenca de palavras).
"""

    client = _get_client()
    try:
        response = client.models.generate_content(
            model=_model_name(),
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=_Verification,
                http_options=types.HttpOptions(timeout=_REQUEST_TIMEOUT_MS),
            ),
        )
    except Exception:
        logger.warning("Gemini indisponivel ao verificar afirmacao", exc_info=True)
        # falha ao verificar = nao aceita a afirmacao (nunca aceita por omissao)
        return _Verification(suportado=False, nota="Nao foi possivel verificar agora.")
    return response.parsed


def _insuficiente(facts: AlbumFacts, motivo: str) -> StoryResult:
    return StoryResult(
        facts=facts,
        gancho=None,
        gancho_fonte=None,
        historia=None,
        historia_fontes=[],
        insuficiente=True,
        motivo=motivo,
    )


def generate_story(facts: AlbumFacts) -> StoryResult:
    if facts.insuficiente:
        return _insuficiente(facts, facts.motivo or "Sem fontes suficientes.")

    draft = _draft_story(facts)
    if draft is None or not draft.suficiente:
        return _insuficiente(
            facts, "O modelo nao encontrou um fato suficientemente fundamentado nas fontes."
        )

    valid_urls = {s.url for s in facts.sources}
    if draft.gancho_fonte_url not in valid_urls:
        return _insuficiente(facts, "O gancho gerado citou uma fonte que nao veio da busca.")

    historia_fontes = [u for u in draft.historia_fontes_urls if u in valid_urls]

    gancho_check = _verify_claim(draft.gancho, facts)
    if not gancho_check.suportado:
        return _insuficiente(
            facts, f"O gancho gerado nao passou na verificacao: {gancho_check.nota}"
        )

    historia_check = _verify_claim(draft.historia, facts)
    historia = draft.historia if historia_check.suportado else None
    if not historia_check.suportado:
        historia_fontes = []

    return StoryResult(
        facts=facts,
        gancho=draft.gancho,
        gancho_fonte=draft.gancho_fonte_url,
        historia=historia,
        historia_fontes=historia_fontes,
        insuficiente=False,
        motivo=None if historia else f"Historia descartada na verificacao: {historia_check.nota}",
    )
