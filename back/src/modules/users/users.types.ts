import type { Request } from "express";

export interface UpdateUserDTO {
	nome?: string;
	telefone?: string;
	cep?: string;
}

export interface UserResponse {
	id_usuario: number;
	nome: string;
	email: string;
	telefone: string;
	cep: string;
}

export interface AuthenticatedUser {
	id: number;
}

export interface ErrorResponse {
	message: string;
}

export interface AuthRequest<TParams, TBody>
	extends Request<TParams, unknown, TBody> {
	user: AuthenticatedUser;
}
