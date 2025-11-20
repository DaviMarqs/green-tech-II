import { http } from "./http";

// --- TIPOS ---

export type OrderItem = {
	id: number;
	id_pedido: number;
	id_produto: number;
	quantidade: number;
	preco_unitario: string;
	created_at: string;
	updated_at: string | null;
};

export type Order = {
	id_pedido: number;
	forma_pagamento: string;
	parcelas?: number;
	total: string;
	valor: number;
	status: string;
	created_at: string;
	updated_at: string | null;
	itens?: OrderItem[];
};

export interface ProductOrderDTO {
	idProduto: number;
	quantidade: number;
}

export type CreateOrderDTO = {
	compradorId: number;
	vendedorId: number;
	formaPagamento: string;
	parcelas?: number;
	produtos: ProductOrderDTO[]; // Backend espera 'produtos', não 'itens'
};

export type UpdateOrderDTO = Partial<CreateOrderDTO> & {
	status?: string;
};

export type ListOrderResponse = {
	items: Order[];
	total?: number;
	page?: number;
	pageSize?: number;
};

const path = "/orders";

export const orderService = {
	create(data: CreateOrderDTO, signal?: AbortSignal) {
		return http<Order>(path, { method: "POST", body: data, signal });
	},

	list(signal?: AbortSignal) {
		return http<ListOrderResponse | Order[]>(path, {
			method: "GET",
			signal,
		});
	},

	listByUser(userId: string | number, signal?: AbortSignal) {
		return http<ListOrderResponse | Order[]>(`${path}/user/${userId}`, {
			method: "GET",
			signal,
		});
	},

	getById(id: string | number, signal?: AbortSignal) {
		return http<Order>(`${path}/${id}`, { method: "GET", signal });
	},

	update(id: string | number, data: UpdateOrderDTO, signal?: AbortSignal) {
		return http<Order>(`${path}/${id}`, {
			method: "PUT",
			body: data,
			signal,
		});
	},

	delete(id: string | number, signal?: AbortSignal) {
		return http<void>(`${path}/${id}`, { method: "DELETE", signal });
	},
};
