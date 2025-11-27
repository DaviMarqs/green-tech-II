import type { Endereco } from "../../entities/address/endereco.entity";

export interface RegisterEnderecoDTO {
  numero: string;
  complemento: string;
  cep: string;
  logradouro: string;
  bairro: string;
  user_id: number;
  id_estado: number;
  id_cidade: number;
}

export interface RegisterEnderecoResponse {
  message: string;
  endereco: Endereco;
}
