// Dados de exemplo pra Fase 0: tudo abaixo (capa, faixas, paleta) vem direto
// do output de scripts/fetch_album.py (API da Deezer). O "gancho" é o fato
// real já levantado no brief do produto, citado com fonte. O "por que pra
// você" aqui é um placeholder ilustrativo — na versão real ele nasce do
// perfil de gosto da pessoa, não é escrito à mão.

export type FichaExemplo = {
  artist: string;
  album: string;
  releaseDate: string;
  genre: string;
  coverUrl: string;
  deezerLink: string;
  palette: {
    background: string;
    accent: string;
    colors: string[];
  };
  leadTrack: {
    title: string;
    previewUrl: string;
  };
  gancho: string;
  ganchoFonte: string;
  porQuePraVoce: string;
};

export const exampleFichas: FichaExemplo[] = [
  {
    artist: "Arthur Verocai",
    album: "Arthur Verocai",
    releaseDate: "1972",
    genre: "Jazz / MPB",
    coverUrl:
      "https://cdn-images.dzcdn.net/images/cover/5401f778d069114610bb4ce87f944be9/1000x1000-000000-80-0-0.jpg",
    deezerLink: "https://www.deezer.com/album/1494527",
    palette: {
      background: "#433133",
      accent: "#F9F1BC",
      colors: ["#F9F1BC", "#6B4B42", "#EBD49E", "#CA8268", "#433133"],
    },
    leadTrack: {
      title: "Na boca do sol",
      previewUrl:
        "https://cdnt-preview.dzcdn.net/api/1/1/0/3/5/0/035d9625014b7cfeaf4ff9ec3ee35e23.mp3",
    },
    gancho:
      "Fracassou em 1972, fez o autor largar a música, e 30 anos depois virou tesouro do hip-hop americano.",
    ganchoFonte: "Wikipédia / história do disco",
    porQuePraVoce:
      "Exemplo ilustrativo — na versão real, essa frase conecta o disco ao seu perfil de gosto (gêneros, tags e artistas em comum).",
  },
];
