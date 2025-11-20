import type { Request, Response, NextFunction } from "express";
import * as paymentMethodService from "./paymentMethod.service";
import type {
	CreatePaymentMethodDTO,
	UpdatePaymentMethodDTO,
} from "./paymentMethod.types";

export const createPaymentMethodController = async (
	req: Request<{}, {}, CreatePaymentMethodDTO>,
	res: Response,
	next: NextFunction,
) => {
	try {
		const result = await paymentMethodService.createPaymentMethod(req.body);
		return res.status(201).json(result);
	} catch (error) {
		next(error);
	}
};

export const listPaymentMethodsController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const onlyActive = req.query.active === "true";
		const result = await paymentMethodService.listPaymentMethods(onlyActive);
		return res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const getPaymentMethodByIdController = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction,
) => {
	try {
		const result = await paymentMethodService.getPaymentMethodById(
			Number(req.params.id),
		);
		return res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const updatePaymentMethodController = async (
	req: Request<{ id: string }, {}, UpdatePaymentMethodDTO>,
	res: Response,
	next: NextFunction,
) => {
	try {
		const result = await paymentMethodService.updatePaymentMethod(
			Number(req.params.id),
			req.body,
		);
		return res.status(200).json(result);
	} catch (error) {
		next(error);
	}
};

export const deletePaymentMethodController = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction,
) => {
	try {
		await paymentMethodService.deletePaymentMethod(Number(req.params.id));
		return res.status(204).send();
	} catch (error) {
		next(error);
	}
};
