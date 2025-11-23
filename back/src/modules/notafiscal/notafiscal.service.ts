import { AppDataSource } from "../../database/data-source";
import { NotaFiscal } from "../../entities/store/notafiscal.entity";
import { AppError } from "../../errors/AppError";
import { CreateNotaFiscalDTO, UpdateNotaFiscalDTO } from "./notafiscal.types";

const repo = AppDataSource.getRepository(NotaFiscal);

export const createNotaFiscal = async (
  data: CreateNotaFiscalDTO
): Promise<NotaFiscal> => {
  if (!data.id_pedido) {
    throw new AppError("id_pedido é obrigatório.", 400);
  }

  const novo = repo.create(data);
  await repo.save(novo);

  return novo;
};

export const listNotasFiscais = async (): Promise<NotaFiscal[]> => {
  return repo.find({ relations: ["pedido"] });
};

export const getNotaFiscalById = async (
  nf_numero: number
): Promise<NotaFiscal> => {
  const nota = await repo.findOne({
    where: { id_pedido: nf_numero },
    relations: ["pedido"],
  });

  if (!nota) throw new AppError("Nota fiscal não encontrada.", 404);

  return nota;
};

export const updateNotaFiscal = async (
  nf_numero: number,
  data: UpdateNotaFiscalDTO
): Promise<NotaFiscal> => {
  const existente = await repo.findOneBy({ nf_numero });

  if (!existente) throw new AppError("Nota fiscal não encontrada.", 404);

  Object.assign(existente, data);

  await repo.save(existente);

  return existente;
};

export const deleteNotaFiscal = async (nf_numero: number) => {
  const existente = await repo.findOneBy({ nf_numero });

  if (!existente) throw new AppError("Nota fiscal não encontrada.", 404);

  await repo.delete(nf_numero);
};
