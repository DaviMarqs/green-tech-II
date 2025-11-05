import type { Request, Response, NextFunction } from "express";
import * as orderService from "./orders.service";
import type {
	CreateOrderDTO,
	OrderResponse,
	ErrorResponse,
} from "./orders.types";
import { AppError } from "../../errors/AppError";
import type { PedidoStatus } from "../../entities/store/order.entity";

export const createOrderController = async (
	req: Request<{}, OrderResponse | ErrorResponse, CreateOrderDTO>,
	res: Response,
	next: NextFunction,
) => {
	try {
		const order = await orderService.createOrder(req.body);
		return res.status(201).json(order);
	} catch (error) {
		next(error);
	}
};

export const listOrdersController = async (
	req: Request<{ userId: string }>,
	res: Response,
	next: NextFunction,
) => {
	try {
		const orders = await orderService.listOrdersByUser(
			Number(req.params.userId),
		);
		return res.status(200).json(orders);
	} catch (error) {
		next(error);
	}
};

export const getOrderByIdController = async (
	req: Request<{ id: string }>,
	res: Response,
	next: NextFunction,
) => {
	try {
		const order = await orderService.getOrderById(Number(req.params.id));
		if (!order) throw new AppError("Pedido não encontrado", 404);

		return res.status(200).json(order);
	} catch (error) {
		next(error);
	}
};

export const updateOrderStatusController = async (
	req: Request<{ id: string }, unknown, { status: string }>,
	res: Response,
	next: NextFunction,
) => {
	try {
		const updated = await orderService.updateOrderStatus(
			Number(req.params.id),
			req.body.status as PedidoStatus,
		);
		return res.status(200).json(updated);
	} catch (error) {
		next(error);
	}
};
