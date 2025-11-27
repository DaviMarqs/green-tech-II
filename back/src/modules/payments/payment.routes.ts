import { Router } from "express";
import { createPaymentController } from "./payment.controller";
import { protect } from "../../middleware/auth.middleware";

const paymentRoutes = Router();

paymentRoutes.post("/", protect, createPaymentController); 

export default paymentRoutes;
