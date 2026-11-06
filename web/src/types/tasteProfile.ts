// Espelha o schema da API (api/app/schemas.py).

export type Distancia = "perto" | "meio" | "salto";

export type TasteProfileRequest = {
  items: string[];
  distancia: Distancia;
};

export type TasteProfileResponse = {
  status: string;
  items: string[];
  distancia: Distancia;
};
