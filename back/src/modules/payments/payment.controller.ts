import type { Request, Response, NextFunction } from "express";
import * as paymentService from "./payment.service";
import type {
	CreatePaymentDTO,
	CreatePaymentBody,
	PaymentResponse,
	ErrorResponse,
} from "./payment.types";
import { AppError } from "../../errors/AppError";

export const createPaymentController = async (
	req: Request<unknown, unknown, CreatePaymentBody>,
	res: Response<PaymentResponse | ErrorResponse>,
	next: NextFunction,
) => {
	try {
		if (!req.user) {
			throw new AppError("Usuário não autenticado.", 401);
		}
		const userId = req.user.id;

		const paymentData = req.body;

		const fullPaymentDTO: CreatePaymentDTO = {
			...paymentData,
			id_usuario: userId,
		};

		if (!fullPaymentDTO.id_pedido || !fullPaymentDTO.valor) {
			return res.status(400).json({ message: "Dados obrigatórios ausentes." });
		}

		const result = await paymentService.createPayment(fullPaymentDTO);

		res.status(201).json(result);
	} catch (err) {
		next(err);
	}
};
