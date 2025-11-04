import type { PagamentoStatus } from "../../entities/store/payment.entity";

export interface CreatePaymentDTO {
	id_pedido: number;
	id_usuario: number;
	metodo_pagamento: string;
	valor: number;
	parcelas?: number;
}

export type CreatePaymentBody = Omit<CreatePaymentDTO, "id_usuario">;

export interface PaymentResponse {
	id_pagamento: number;
	id_pedido: number;
	status: PagamentoStatus;
	valor: number;
	metodo: string;
}

export interface ErrorResponse {
	message: string;
}
