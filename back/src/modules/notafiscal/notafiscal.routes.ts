import { Router } from "express";
import {
  createNotaFiscalController,
  listNotasFiscaisController,
  getNotaFiscalByIdController,
  updateNotaFiscalController,
  deleteNotaFiscalController,
  getNotaFiscalPdfController,
} from "./notafiscal.controller";

const notafiscalRoutes = Router();

notafiscalRoutes.post("/", createNotaFiscalController);
notafiscalRoutes.get("/", listNotasFiscaisController);
notafiscalRoutes.get("/:id/pdf", getNotaFiscalPdfController);
notafiscalRoutes.get("/:id", getNotaFiscalByIdController);
notafiscalRoutes.patch("/:id", updateNotaFiscalController);
notafiscalRoutes.delete("/:id", deleteNotaFiscalController);

export default notafiscalRoutes;
