import { Router } from "express";
import {
	createPaymentMethodController,
	deletePaymentMethodController,
	getPaymentMethodByIdController,
	listPaymentMethodsController,
	updatePaymentMethodController,
} from "./paymentMethod.controller";

// Adicione middlewares de autenticação/admin aqui se necessário
// import { protect } from "../middleware/auth.middleware";

const paymentMethodRoutes = Router();

paymentMethodRoutes.post("/", createPaymentMethodController);
paymentMethodRoutes.get("/", listPaymentMethodsController);
paymentMethodRoutes.get("/:id", getPaymentMethodByIdController);
paymentMethodRoutes.patch("/:id", updatePaymentMethodController);
paymentMethodRoutes.delete("/:id", deletePaymentMethodController);

export default paymentMethodRoutes;
