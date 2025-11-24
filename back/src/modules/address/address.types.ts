import type { Endereco } from "../../entities/address/endereco.entity";

export interface RegisterEnderecoDTO {
<<<<<<< Updated upstream
	numero: string;
	complemento?: string;
	logradouro: {
		cep: string;
		logradouro: string;
	};
	bairro: {
		nome: string;
	};
	cidade: {
		nome: string;
	};
	estado: {
		nome: string;
		sigla: string;
	};
=======
  numero: string;
  complemento: string;
  cep: string;
  logradouro: string;
  bairro: string;
  user_id: number;
  id_cidade: number;
  id_estado: number;
>>>>>>> Stashed changes
}

export interface RegisterEnderecoResponse {
	message: string;
	endereco: Endereco;
}
