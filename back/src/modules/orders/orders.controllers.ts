import type { Request, Response } from "express";
import * as orderService from "./orders.service";
import type {
  CreateOrderDTO,
  OrderResponse,
  ErrorResponse,
} from "./orders.types";
import { AppError } from "../../errors/AppError";

export const createOrderController = async (
  req: Request<{}, OrderResponse | ErrorResponse, CreateOrderDTO>,
  res: Response
) => {
  try {
    const order = await orderService.createOrder(req.body);
    return res.status(201).json(order);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};

export const listOrdersController = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  try {
    const orders = await orderService.listOrdersByUser(
      Number(req.params.userId)
    );
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar pedidos" });
  }
};

export const getOrderByIdController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const order = await orderService.getOrderById(Number(req.params.id));
    if (!order)
      return res.status(404).json({ message: "Pedido não encontrado" });
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar pedido" });
  }
};

export const updateOrderStatusController = async (
  req: Request<{ id: string }, unknown, { status: string }>,
  res: Response
) => {
  try {
    const updated = await orderService.updateOrderStatus(
      Number(req.params.id),
      req.body.status
    );
    return res.status(200).json(updated);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro ao atualizar status" });
  }
};
