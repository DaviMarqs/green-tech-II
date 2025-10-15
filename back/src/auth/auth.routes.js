import { Router } from "express";
import { registerController, loginController } from "./auth.controller.js";

const authRoutes = Router();

authRoutes.post("/register", registerController);
authRoutes.post("/login", loginController);

export default authRoutes;
