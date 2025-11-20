export interface ProductOrder {
	idProduto: number;
	quantidade: number;
}

export interface CreateOrderDTO {
	compradorId: number;
	vendedorId: number;
	formaPagamento: string;
	parcelas?: number;
	produtos: ProductOrder[];
}

export interface OrderResponse {
	id_pedido: number;
	valor: number;
	forma_pagamento: string;
	parcelas: number;
	status: string;
	data_pedido: string;
}

export interface ErrorResponse {
	message: string;
}
