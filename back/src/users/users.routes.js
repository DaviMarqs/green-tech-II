import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { deactivateController, updateController } from "./users.controller.js";

const userRoutes = Router();

//Torna as rotas privadas
userRoutes.use(protect);

//Rota para atualizar usuario
userRoutes.put("/:id", updateController);

//Rota para desativar o usuario
userRoutes.delete("/:id", deactivateController);

export default userRoutes;
