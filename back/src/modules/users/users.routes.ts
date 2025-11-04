import { Router } from "express";
import {
  deactivateController,
  resetPasswordController,
  updateController,
} from "./users.controller";
import { protect } from "../../middleware/auth.middleware";

const userRoutes = Router();
// Rota para resetar a senha
userRoutes.put("/resetPassword", resetPasswordController);

//Torna as rotas privadas
// userRoutes.use(protect);

//Rota para atualizar usuario
userRoutes.put("/:id", () => updateController);

//Rota para desativar o usuario
userRoutes.delete("/:id", () => deactivateController);

export default userRoutes;
