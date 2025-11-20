import { http } from "./http";

export interface UserProfile {
	id_usuario: number;
	nome: string;
	email: string;
	telefone: string;
	cep: string;
	cpfCnpj?: string;
	data_nasc?: string;
	numero?: string;
}

export interface UpdateUserPayload {
	nome?: string;
	email?: string;
	telefone?: string;
	cep?: string;
	senha?: string;
	numero?: string;
	data_nasc?: string;
}

const path = "/users";

export const userService = {
	// Busca os dados do usuário logado
	getProfile: async (signal?: AbortSignal) => {
		return http<UserProfile>(`${path}/profile`, { method: "GET", signal });
	},

	// Atualiza os dados
	updateProfile: async (
		id: number,
		data: UpdateUserPayload,
		signal?: AbortSignal,
	) => {
		return http<UserProfile>(`${path}/${id}`, {
			method: "PUT",
			body: data,
			signal,
		});
	},
};

export const addressService = {
	getAddressByCep: async (cep: string) => {
		const cleanCep = cep.replace(/\D/g, "");
		if (cleanCep.length !== 8) return null;
		try {
			const response = await fetch(
				`https://viacep.com.br/ws/${cleanCep}/json/`,
			);
			const data = await response.json();
			if (data.erro) return null;
			return data;
		} catch {
			return null;
		}
	},
};
