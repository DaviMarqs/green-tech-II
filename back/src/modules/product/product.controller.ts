import type { Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFilteredProducts,
  getProductById,
  getProductsByUser,
  updateProduct,
} from "./product.service";

export const createController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = {
      ...req.body,
    };

    const product = await createProduct(data);
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    if (error instanceof AppError)
      res.status(error.statusCode).json({ message: error.message });
    else res.status(500).json({ message: "Erro desconhecido." });
  }
};

export const listFilteredController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { page, limit, nome, minPreco, maxPreco } = req.query;

    const result = await getFilteredProducts({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      nome: nome ? String(nome) : undefined,
      minPreco: minPreco ? Number(minPreco) : undefined,
      maxPreco: maxPreco ? Number(maxPreco) : undefined,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    if (error instanceof AppError)
      res.status(error.statusCode).json({ message: error.message });
    else res.status(500).json({ message: "Erro ao listar produtos." });
  }
};

export const listController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id_usuario } = req.query;
    console.log("ID do usuário na listController:", id_usuario);
    const products = await getAllProducts(
      id_usuario ? Number(id_usuario) : undefined
    );
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao listar produtos." });
  }
};

export const getByIdController = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const product = await getProductById(Number(req.params.id));
    res.status(200).json(product);
  } catch (error) {
    if (error instanceof AppError)
      res.status(error.statusCode).json({ message: error.message });
    else res.status(500).json({ message: "Erro desconhecido." });
  }
};

export const updateController = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const updated = await updateProduct(Number(req.params.id), req.body);
    res.status(200).json(updated);
  } catch (error) {
    if (error instanceof AppError)
      res.status(error.statusCode).json({ message: error.message });
    else res.status(500).json({ message: "Erro desconhecido." });
  }
};

export const deleteController = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const result = await deleteProduct(Number(req.params.id));
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof AppError)
      res.status(error.statusCode).json({ message: error.message });
    else res.status(500).json({ message: "Erro desconhecido." });
  }
};

export const listByUserController = async (
  req: Request<{ id_usuario: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id_usuario } = req.params;
    const products = await getProductsByUser(Number(id_usuario));
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    if (error instanceof AppError)
      res.status(error.statusCode).json({ message: error.message });
    else
      res.status(500).json({ message: "Erro ao listar produtos do usuário." });
  }
};
