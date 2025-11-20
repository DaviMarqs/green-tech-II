import api from "@/lib/api";

export interface PaymentMethod {
	id_pagamento: number;
	forma_pagamento: string;
	parcelamento: number;
	ativo: boolean;
}

export interface PixMetadata {
	mensagem: string;
	codigo_pix: string;
}

export interface BoletoMetadata {
	mensagem: string;
	linha_digitavel: string;
}

export interface CartaoMetadata {
	mensagem: string;
	nsu: string;
}

export interface FalhaMetadata {
	mensagem: string;
}

export type PaymentMetadata =
	| PixMetadata
	| BoletoMetadata
	| CartaoMetadata
	| FalhaMetadata;

export interface PaymentResponse {
	id_pagamento: number;
	id_pedido: number;
	status: string;
	valor: number;
	metodo: string;
	metadata?: PaymentMetadata;
}

export interface CreatePaymentDTO {
	id_pedido: number;
	metodo_pagamento: string;
	valor: number;
	parcelas?: number;
}

const methodsPath = "/payment-methods";
const paymentPath = "/payments";

export const paymentService = {
	getPaymentMethods: async (active = true, signal?: AbortSignal) => {
		const query = active ? "?active=true" : "";
		const response = await api.get<PaymentMethod[]>(`${methodsPath}${query}`, {
			signal,
		});
		return response.data;
	},

	process: async (data: CreatePaymentDTO, signal?: AbortSignal) => {
		const response = await api.post<PaymentResponse>(paymentPath, data, {
			signal,
		});
		return response.data;
	},
};
