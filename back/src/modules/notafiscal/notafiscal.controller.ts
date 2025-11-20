import { Request, Response, NextFunction } from "express";
import * as service from "./notafiscal.service";

export const createNotaFiscalController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const nota = await service.createNotaFiscal(req.body);
    res.status(201).json(nota);
  } catch (err) {
    next(err);
  }
};

export const listNotasFiscaisController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const notas = await service.listNotasFiscais();
    res.json(notas);
  } catch (err) {
    next(err);
  }
};

export const getNotaFiscalByIdController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const nota = await service.getNotaFiscalById(Number(req.params.id));
    res.json(nota);
  } catch (err) {
    next(err);
  }
};

export const updateNotaFiscalController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const nota = await service.updateNotaFiscal(
      Number(req.params.id),
      req.body
    );
    res.json(nota);
  } catch (err) {
    next(err);
  }
};

export const deleteNotaFiscalController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    await service.deleteNotaFiscal(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
