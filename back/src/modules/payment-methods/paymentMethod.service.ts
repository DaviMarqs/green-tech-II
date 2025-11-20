import { AppDataSource } from "../../database/data-source";
import { AppError } from "../../errors/AppError";
import { FormaPagamento } from "../../entities/store/paymentMethod.entity";
import type {
	CreatePaymentMethodDTO,
	UpdatePaymentMethodDTO,
} from "./paymentMethod.types";

const paymentMethodRepository = AppDataSource.getRepository(FormaPagamento);

export const createPaymentMethod = async (
	data: CreatePaymentMethodDTO,
): Promise<FormaPagamento> => {
	const { forma_pagamento, parcelamento, ativo } = data;

	const existingMethod = await paymentMethodRepository.findOneBy({
		forma_pagamento,
	});
	if (existingMethod) {
		throw new AppError("Forma de pagamento já cadastrada.", 400);
	}

	const paymentMethod = paymentMethodRepository.create({
		forma_pagamento,
		parcelamento,
		ativo: ativo !== undefined ? ativo : true,
	});

	await paymentMethodRepository.save(paymentMethod);

	return paymentMethod;
};

export const listPaymentMethods = async (
	onlyActive = false,
): Promise<FormaPagamento[]> => {
	const where = onlyActive ? { ativo: true } : {};
	return paymentMethodRepository.find({
		where,
		order: { forma_pagamento: "ASC" },
	});
};

export const getPaymentMethodById = async (
	id: number,
): Promise<FormaPagamento> => {
	const paymentMethod = await paymentMethodRepository.findOneBy({
		id_pagamento: id,
	});

	if (!paymentMethod) {
		throw new AppError("Forma de pagamento não encontrada.", 404);
	}

	return paymentMethod;
};

export const updatePaymentMethod = async (
	id: number,
	data: UpdatePaymentMethodDTO,
): Promise<FormaPagamento> => {
	const paymentMethod = await getPaymentMethodById(id);

	paymentMethodRepository.merge(paymentMethod, {
		forma_pagamento: data.forma_pagamento,
		parcelamento: data.parcelamento,
		ativo: data.ativo,
	});

	await paymentMethodRepository.save(paymentMethod);

	return paymentMethod;
};

export const deletePaymentMethod = async (id: number): Promise<void> => {
	const paymentMethod = await getPaymentMethodById(id);
	await paymentMethodRepository.remove(paymentMethod);
};
