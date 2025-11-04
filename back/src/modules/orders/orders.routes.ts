import { Router } from "express";
import {
  createOrderController,
  getOrderByIdController,
  listOrdersController,
  updateOrderStatusController,
} from "./orders.controllers";

const orderRoutes = Router();

// Criar pedido (checkout)
orderRoutes.post("/", createOrderController);

// Listar pedidos do usuário
orderRoutes.get("/user/:userId", listOrdersController);

// Buscar pedido por ID
orderRoutes.get("/:id", getOrderByIdController);

// Atualizar status (ex: pagamento confirmado)
orderRoutes.patch("/:id/status", updateOrderStatusController);

export default orderRoutes;
