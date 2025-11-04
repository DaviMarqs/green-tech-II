// src/modules/endereco/endereco.routes.ts
import { Router } from "express";
import { createEnderecoController } from "./address.controller";

const addressRoutes = Router();

addressRoutes.post("/", createEnderecoController);

export default addressRoutes;
