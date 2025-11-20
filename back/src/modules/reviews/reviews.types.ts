export interface CreateReviewDTO {
	produtoId: number;
	nota: number;
	descricao?: string;
}

export interface UpdateReviewDTO {
	nota?: number;
	descricao?: string;
}

export interface ReviewResponse {
	id_avaliacao: number;
	nota: number;
	descricao: string;
	usuario_nome: string;
	data: Date;
}

export interface PaginatedReviewsResponse {
	data: ReviewResponse[];
	meta: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		mediaGeral: number;
	};
}
