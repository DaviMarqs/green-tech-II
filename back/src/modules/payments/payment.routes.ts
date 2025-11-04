import { Router } from "express";
import { createPaymentController } from "./payment.controller";
import { protect } from "../../middleware/auth.middleware";

const paymentRoutes = Router();

paymentRoutes.post("/", protect, createPaymentController); //Verifica se o pagamento foi aprovado

export default paymentRoutes;
