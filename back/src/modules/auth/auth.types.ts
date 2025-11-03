// DTO para o 'body' do registro
export interface RegisterUserDTO {
	nome: string;
	cpf: string; // Na migration é cpf_cnpj
	email: string;
	senha: string;
	telefone?: string;
	cep: string; // Usado para a FK do Logradouro
	data_nasc: string; // Ex: "DD/MM/AAAA"
}

// DTO para o 'body' do login
export interface LoginDTO {
	email: string;
	senha: string;
}

// O que retornamos sobre o usuário após o login/registro
export interface UserAuthResponse {
	id_usuario: number;
	nome: string;
	email: string;
}

// A resposta completa do login
export interface AuthResponse {
	message: string;
	user: UserAuthResponse;
	token: string;
}

// A resposta do registro
export interface RegisterResponse {
	message: string;
	user: UserAuthResponse;
}
