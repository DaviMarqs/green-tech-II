import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import {
  createController,
  deleteController,
  getByIdController,
  listController,
  listFilteredController,
  updateController,
} from "./product.controller";

const productRoutes = Router();

// Todas as rotas protegidas
// productRoutes.use(protect);

// CRUD completo
productRoutes.post("/", createController); // Criar produto
productRoutes.get("/", listController); // Listar todos
productRoutes.get("/filtered", listFilteredController); // Listar filtrado
productRoutes.get("/:id", getByIdController); // Obter por ID
productRoutes.put("/:id", updateController); // Atualizar
productRoutes.delete("/:id", deleteController); // Deletar

export default productRoutes;
