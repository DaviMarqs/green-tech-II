// address.controller.ts
import type { Request, Response, NextFunction } from "express";
import {
  createCompleto,
  getAllEnderecos,
  getEnderecoById,
  updateEndereco,
  deleteEndereco,
  listEstados,
  listCidadesByEstado,
} from "./address.service";
import type { RegisterEnderecoDTO } from "./address.types";
import { AppDataSource } from "../../database/data-source";
import { Endereco } from "../../entities/address/endereco.entity";

export const createEnderecoController = async (
  req: Request<unknown, unknown, RegisterEnderecoDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;
    const novo = await createCompleto(data);

    return res.status(201).json({
      message: "Endereço criado com sucesso!",
      endereco: novo,
    });
  } catch (err) {
    next(err);
  }
};

export const listEnderecosController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const lista = await getAllEnderecos();
    res.json(lista);
  } catch (err) {
    next(err);
  }
};

export const getEnderecoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const endereco = await getEnderecoById(id);

    if (!endereco) {
      return res.status(404).json({ message: "Endereço não encontrado." });
    }

    res.json(endereco);
  } catch (err) {
    next(err);
  }
};

export const updateEnderecoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const body = req.body;

    const atualizado = await updateEndereco(id, body);

    res.json({
      message: "Endereço atualizado com sucesso!",
      endereco: atualizado,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteEnderecoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);

    await deleteEndereco(id);

    res.json({ message: "Endereço removido com sucesso!" });
  } catch (err) {
    next(err);
  }
};

export const getEstadosController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const estados = await listEstados();
    console.log("estados", estados);

    res.json(estados);
  } catch (err) {
    next(err);
  }
};

// ---------------- CIDADES DO ESTADO ----------------

export const getCidadesByEstadoController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const idEstado = Number(req.params.idEstado);

    const cidades = await listCidadesByEstado(idEstado);

    res.json(cidades);
  } catch (err) {
    next(err);
  }
};

export const getAddressByUserId = async (req: Request, res: Response) => {
  try {
    const { id_usuario } = req.params;

    const repo = AppDataSource.getRepository(Endereco);

    const enderecos = await repo.find({
      where: { user_id: Number(id_usuario) },
      relations: ["estado", "cidade"],
      order: { id_endereco: "ASC" },
    });

    return res.json(enderecos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao buscar endereço do usuário.",
    });
  }
};
