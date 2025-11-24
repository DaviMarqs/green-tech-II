import { QueryFailedError, type DataSource, type EntityManager } from "typeorm";
import { Estado } from "../../entities/address/estado.entity";
import { Cidade } from "../../entities/address/cidade.entity";
import { Bairro } from "../../entities/address/bairro.entity";
import { Logradouro } from "../../entities/address/logradouro.entity";
import { Endereco } from "../../entities/address/endereco.entity";
import { AppDataSource } from "../../database/data-source";
import type { RegisterEnderecoDTO } from "./address.types";
import { AppError } from "../../errors/AppError";

const findOrCreateEstado = async (
  data: { nome: string; sigla: string },
  manager: EntityManager
): Promise<Estado> => {
  console.log("data", data);
  const sigla = data.sigla || "SP";
  let estado = await manager.findOne(Estado, {
    where: { sigla: sigla },
  });
  if (!estado) {
    estado = manager.create(Estado, {
      nome: data.nome,
      sigla: sigla,
    });
    console.log("estado", estado);
    await manager.save(estado);
  }
  return estado;
};
const findOrCreateCidade = async (
  data: { nome: string },
  estado: Estado,
  manager: EntityManager
): Promise<Cidade> => {
  let cidade = await manager.findOne(Cidade, {
    where: {
      nome_cidade: data.nome,
      id_estado: estado.id,
    },
  });
  if (!cidade) {
    cidade = manager.create(Cidade, {
      nome_cidade: data.nome,
      id_estado: estado,
    });
    await manager.save(cidade);
  }
  return cidade;
};

<<<<<<< Updated upstream
const findOrCreateBairro = async (
  data: { nome: string },
  cidade: Cidade,
  manager: EntityManager
): Promise<Bairro> => {
  let bairro = await manager.findOne(Bairro, {
    where: {
      nome_bairro: data.nome,
      id_cidade: cidade.id_cidade,
=======
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
        id_estado: body.id_estado,
        id_cidade: body.id_cidade,
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
      console.log(error)
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
>>>>>>> Stashed changes
    },
  });
  if (!bairro) {
    bairro = manager.create(Bairro, {
      nome_bairro: data.nome,
      id_cidade: cidade,
    });
    await manager.save(bairro);
  }
  return bairro;
};

const findOrCreateLogradouro = async (
  data: { cep: string; logradouro: string },
  bairro: Bairro,
  manager: EntityManager
): Promise<Logradouro> => {
  let logradouro = await manager.findOne(Logradouro, {
    where: { cep: data.cep },
  });
  if (!logradouro) {
    logradouro = manager.create(Logradouro, {
      cep: data.cep,
      logradouro: data.logradouro,
      id_bairro: bairro,
    });
    await manager.save(logradouro);
  }
  return logradouro;
};

export const createCompleto = async (
  body: RegisterEnderecoDTO
): Promise<Endereco> => {
  const dataSource = AppDataSource;

  return dataSource.transaction(
    async (manager: EntityManager): Promise<Endereco> => {
      try {
        console.log("1");
        const estado = await findOrCreateEstado(body.estado, manager);
        console.log("2");
        const cidade = await findOrCreateCidade(body.cidade, estado, manager);
        const bairro = await findOrCreateBairro(body.bairro, cidade, manager);
        const logradouro = await findOrCreateLogradouro(
          body.logradouro,
          bairro,
          manager
        );

        const novoEndereco = manager.create(Endereco, {
          numero: body.numero,
          complemento: body.complemento,
          cep: logradouro,
        });

        await manager.save(novoEndereco);
        return novoEndereco;
      } catch (error) {
        if (error instanceof QueryFailedError) {
          if (
            error.driverError &&
            typeof error.driverError === "object" &&
            "code" in error.driverError &&
            typeof error.driverError.code === "string"
          ) {
            const driverErrorCode = error.driverError.code;

            if (driverErrorCode === "23503") {
              throw new AppError(
                "O CEP informado não foi encontrado ou outro dado de referência é inválido.",
                404
              );
            }

            if (driverErrorCode === "23505") {
              throw new AppError(
                "Um dos dados informados (como CEP) já existe e viola uma regra de unicidade.",
                409
              );
            }
          }
        }

        if (error instanceof AppError) {
          throw error;
        }

        console.error("Erro na transação de endereço:", error);
        throw new AppError("Erro interno ao salvar o endereço.", 500);
      }
    }
  );
};
