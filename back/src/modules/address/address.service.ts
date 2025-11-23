import { QueryFailedError, EntityManager } from "typeorm";

import { Estado } from "../../entities/address/estado.entity";
import { Cidade } from "../../entities/address/cidade.entity";
import { Endereco } from "../../entities/address/endereco.entity";

import { AppDataSource } from "../../database/data-source";
import { AppError } from "../../errors/AppError";

import type { RegisterEnderecoDTO } from "./address.types";

/* ---------------------- FIND OR CREATE ESTADO ---------------------- */

export const findOrCreateEstado = async (
  data: { nome: string; sigla: string },
  manager: EntityManager
) => {
  const sigla = data.sigla;

  let estado = await manager.findOne(Estado, {
    where: { sigla },
  });

  if (!estado) {
    estado = manager.create(Estado, {
      nome_estado: data.nome,
      sigla,
    });

    await manager.save(estado);
  }

  return estado;
};

/* ---------------------- FIND OR CREATE CIDADE ---------------------- */

export const findOrCreateCidade = async (
  data: { nome: string },
  estado: Estado,
  manager: EntityManager
) => {
  let cidade = await manager.findOne(Cidade, {
    where: {
      nome_cidade: data.nome,
      id_estado: estado.id_estado,
    },
  });

  if (!cidade) {
    cidade = manager.create(Cidade, {
      nome_cidade: data.nome,
      id_estado: estado.id_estado,
    });

    await manager.save(cidade);
  }

  return cidade;
};

/* ---------------------- CREATE ENDEREÇO COMPLETO ---------------------- */

export const createCompleto = async (body: RegisterEnderecoDTO) => {
  return AppDataSource.transaction(async (manager) => {
    try {
      const novoEndereco = manager.create(Endereco, {
        bairro: body.bairro || "",
        logradouro: body.logradouro,
        cep: body.cep,
        numero:
          body.numero !== undefined && body.numero !== null
            ? parseInt(body.numero, 10)
            : undefined,
        id_estado: body.estado_id,
        id_cidade: body.cidade_id,
        user_id: body.user_id,
      });

      await manager.save(novoEndereco);

      return novoEndereco;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const code = (error as any)?.driverError?.code;

        if (code === "23503") {
          throw new AppError("Referência inválida.", 404);
        }

        if (code === "23505") {
          throw new AppError("Valor duplicado encontrado.", 409);
        }
      }

      throw new AppError("Erro interno ao criar endereço.", 500);
    }
  });
};

/* ---------------------- CRUD EXTRA ---------------------- */

export const getAllEnderecos = async () => {
  return AppDataSource.getRepository(Endereco).find({
    relations: ["estado", "cidade", "usuario"],
  });
};

export const getEnderecoById = async (id: number) => {
  return AppDataSource.getRepository(Endereco).findOne({
    where: { id_endereco: id },
    relations: ["estado", "cidade", "usuario"],
  });
};

export const updateEndereco = async (
  id: number,
  data: Partial<RegisterEnderecoDTO>
) => {
  const repo = AppDataSource.getRepository(Endereco);
  const endereco = await repo.findOne({ where: { id_endereco: id } });
  if (!endereco) throw new AppError("Endereço não encontrado.", 404);
  Object.assign(endereco, data);
  return repo.save(endereco);
};

export const deleteEndereco = async (id: number) => {
  const repo = AppDataSource.getRepository(Endereco);

  const exists = await repo.findOne({ where: { id_endereco: id } });
  if (!exists) throw new AppError("Endereço não encontrado.", 404);

  await repo.delete(id);
};

export const listEstados = async () => {
  const repo = AppDataSource.getRepository(Estado);
  return repo.find({
    order: {
      nome_estado: "ASC",
    },
  });
};

// ---------------- CIDADES DO ESTADO ----------------

export const listCidadesByEstado = async (idEstado: number) => {
  const repo = AppDataSource.getRepository(Cidade);

  const estadoExiste = await AppDataSource.getRepository(Estado).findOne({
    where: { id_estado: idEstado },
  });

  if (!estadoExiste) {
    throw new AppError("Estado não encontrado.", 404);
  }

  return repo.find({
    where: { id_estado: idEstado },
    order: { nome_cidade: "ASC" },
  });
};
