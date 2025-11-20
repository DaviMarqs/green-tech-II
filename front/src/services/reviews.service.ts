import { http } from "./http";

export type Review = {
	id_avaliacao: number;
	nota: number;
	descricao: string;
	usuario_nome: string;
	data: string;
	id_usuario: number;
};

export type CreateReviewDTO = {
	produtoId: number;
	nota: number;
	descricao?: string;
};

// 👇 Novo tipo
export type UpdateReviewDTO = {
	nota?: number;
	descricao?: string;
};

export type ReviewListResponse = {
	data: Review[];
	meta: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		mediaGeral: number;
	};
};

const path = "/reviews";

export const reviewsService = {
	create(data: CreateReviewDTO, signal?: AbortSignal) {
		return http<Review>(path, { method: "POST", body: data, signal });
	},

	listByProduct(productId: number, page = 1, limit = 5, signal?: AbortSignal) {
		return http<ReviewListResponse>(
			`${path}/product/${productId}?page=${page}&limit=${limit}`,
			{
				method: "GET",
				signal,
			},
		);
	},

	update(id: number, data: UpdateReviewDTO, signal?: AbortSignal) {
		return http<Review>(`${path}/${id}`, {
			method: "PUT",
			body: data,
			signal,
		});
	},

	delete(id: number, signal?: AbortSignal) {
		return http<void>(`${path}/${id}`, { method: "DELETE", signal });
	},
};
