export interface UpdateUserDTO {
	nome?: string;
	telefone?: string;
	cep?: string;
	email?: string;
	senha?: string;
	numero?: string;
	data_nasc?: string;
}

export interface UserResponse {
	id_usuario: number;
	nome: string;
	email: string;
	telefone: string;
	cep: string;
	cpfCnpj: string;
	data_nasc: string | Date;
	numero: string | null;
}

export interface ErrorResponse {
	message: string;
}

export type ResetPasswordDTO = { email: string; senha: string };
export type MessageResponse = { message: string };
