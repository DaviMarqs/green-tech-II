import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import {
	deactivateController,
	getProfileController,
	resetPasswordController,
	updateController,
} from "./users.controller";

const userRoutes = Router();

// Rota pública
userRoutes.put("/resetPassword", resetPasswordController);

userRoutes.use(protect);

// Rota para pegar os dados do usuário logado
userRoutes.get("/profile", getProfileController);

// Rota para atualizar usuário
userRoutes.put("/:id", updateController);

// Rota para desativar o usuário
userRoutes.delete("/:id", deactivateController);

export default userRoutes;
