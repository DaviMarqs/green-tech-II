import { Router } from "express";
import {
  createEnderecoController,
  listEnderecosController,
  getEnderecoController,
  updateEnderecoController,
  deleteEnderecoController,
  getEstadosController,
  getCidadesByEstadoController,
  getAddressByUserId,
} from "./address.controller";

const addressRoutes = Router();

addressRoutes.get("/user/:id_usuario", getAddressByUserId);

addressRoutes.get("/estados", getEstadosController);
addressRoutes.get("/estados/:idEstado/cidades", getCidadesByEstadoController);

addressRoutes.post("/", createEnderecoController);
addressRoutes.get("/", listEnderecosController);
addressRoutes.get("/:id", getEnderecoController);
addressRoutes.put("/:id", updateEnderecoController);
addressRoutes.delete("/:id", deleteEnderecoController);

export default addressRoutes;
