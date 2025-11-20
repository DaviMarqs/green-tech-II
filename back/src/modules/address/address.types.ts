import type { Endereco } from "../../entities/address/endereco.entity";

export interface RegisterEnderecoDTO {
  numero: string;
  complemento: string;
  cep: string;
  logradouro: string;
  bairro: string;
  user_id: number;
  cidade_id: number;
  estado_id: number;
}

export interface RegisterEnderecoResponse {
  message: string;
  endereco: Endereco;
}
