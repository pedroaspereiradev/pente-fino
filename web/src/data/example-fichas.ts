// O "gancho" é o fato real já levantado no brief do produto, citado com
// fonte. O "por que pra você" aqui é um placeholder ilustrativo — na
// versão real ele nasce do perfil de gosto da pessoa, não é escrito à mão.
// Capa, faixas, prévia e paleta vêm ao vivo da API (ver lib/api.ts).

export type FichaEditorial = {
  artist: string;
  album: string;
  gancho: string;
  ganchoFonte: string;
  porQuePraVoce: string;
};

export const exampleFichas: FichaEditorial[] = [
  {
    artist: "Arthur Verocai",
    album: "Arthur Verocai",
    gancho:
      "Fracassou em 1972, fez o autor largar a música, e 30 anos depois virou tesouro do hip-hop americano.",
    ganchoFonte: "Wikipédia / história do disco",
    porQuePraVoce:
      "Exemplo ilustrativo — na versão real, essa frase conecta o disco ao seu perfil de gosto (gêneros, tags e artistas em comum).",
  },
];
