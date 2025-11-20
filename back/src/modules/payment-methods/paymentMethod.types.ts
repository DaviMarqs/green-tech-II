export interface CreatePaymentMethodDTO {
	forma_pagamento: string;
	parcelamento: number;
	ativo?: boolean;
}

export interface UpdatePaymentMethodDTO {
	forma_pagamento?: string;
	parcelamento?: number;
	ativo?: boolean;
}

export interface PaymentMethodResponse {
	id_pagamento: number;
	forma_pagamento: string;
	parcelamento: number;
	ativo: boolean;
}
