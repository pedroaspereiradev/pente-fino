from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import requests

from app.deezer import AlbumNotFoundError, fetch_album
from app.schemas import AlbumResult, TasteProfileRequest, TasteProfileResponse

app = FastAPI(title="pente.fino API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/albums/search", response_model=AlbumResult)
def search(
    artist: str = Query(..., min_length=1),
    album: str = Query(..., min_length=1),
) -> AlbumResult:
    try:
        return fetch_album(artist, album)
    except AlbumNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Falha ao consultar a Deezer: {e}")


@app.post("/taste-profile", response_model=TasteProfileResponse)
def taste_profile(payload: TasteProfileRequest) -> TasteProfileResponse:
    # Ainda nao ha perfil de gosto (embeddings/pgvector) nem recomendacao de
    # verdade - por enquanto so valida e confirma o recebimento.
    return TasteProfileResponse(
        status="recebido",
        items=payload.items,
        distancia=payload.distancia,
    )
