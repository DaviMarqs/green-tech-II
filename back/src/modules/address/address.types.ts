import type { Endereco } from "../../entities/address/endereco.entity";

export interface RegisterEnderecoDTO {
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
}

export interface RegisterEnderecoResponse {
	message: string;
	endereco: Endereco;
}
