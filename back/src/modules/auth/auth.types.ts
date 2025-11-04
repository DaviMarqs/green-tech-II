export interface RegisterUserDTO {
	nome: string;
	cpf: string;
	email: string;
	senha: string;
	telefone?: string;
	cep: string;
	data_nasc: string;
}

export interface LoginDTO {
	email: string;
	senha: string;
}

export interface UserAuthResponse {
	id_usuario: number;
	nome: string;
	email: string;
}

export interface AuthResponse {
	message: string;
	user: UserAuthResponse;
	token: string;
}

export interface RegisterResponse {
	message: string;
	user: UserAuthResponse;
}
