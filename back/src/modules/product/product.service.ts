import { AppDataSource } from "../../database/data-source";
import { Produto } from "../../entities/store/product.entity";
import { AppError } from "../../errors/AppError";
import {
  CreateProductDTO,
  ProductFilter,
  ProductResponse,
  UpdateProductDTO,
} from "../product/product.types";

const productRepository = AppDataSource.getRepository(Produto);

export const createProduct = async (
  data: CreateProductDTO
): Promise<ProductResponse> => {
  const newProduct = productRepository.create(data);
  const savedProduct = await productRepository.save(newProduct);
  return savedProduct;
};

export const getAllProducts = async (
  id_usuario?: number
): Promise<ProductResponse[]> => {
  const query = productRepository
    .createQueryBuilder("produto")
    .leftJoinAndSelect("produto.usuario", "usuario")
    .select([
      "produto.id",
      "produto.nome",
      "produto.descricao",
      "produto.preco",
      "produto.estoque",
      "produto.id_usuario",
      "produto.created_at",
      "produto.updated_at",
      "usuario.id_usuario",
      "usuario.nome",
    ])
    .orderBy("produto.created_at", "DESC");

  if (id_usuario) {
    query.andWhere("produto.id_usuario != :id_usuario", { id_usuario });
  }

  return await query.getMany();
};

export const getProductById = async (id: number): Promise<ProductResponse> => {
  const product = await productRepository.findOne({
    where: { id: id },
    relations: ["usuario"],
    select: {
      id: true,
      nome: true,
      descricao: true,
      preco: true,
      estoque: true,
      id_usuario: true,
      created_at: true,
      updated_at: true,
      usuario: {
        id_usuario: true,
        nome: true,
      },
    },
  });
  if (!product) throw new AppError("Produto não encontrado.", 404);
  return product;
};

export const getFilteredProducts = async ({
  page = 1,
  limit = 10,
  nome,
  minPreco,
  maxPreco,
}: ProductFilter) => {
  const query = productRepository.createQueryBuilder("produto");

  query.leftJoinAndSelect("produto.usuario", "usuario");

  query.addSelect(["usuario.id_usuario", "usuario.nome"]);

  if (nome) query.andWhere("produto.nome ILIKE :nome", { nome: `%${nome}%` });
  if (minPreco) query.andWhere("produto.preco >= :minPreco", { minPreco });
  if (maxPreco) query.andWhere("produto.preco <= :maxPreco", { maxPreco });

  const skip = (page - 1) * limit;
  query.skip(skip).take(limit);

  query.orderBy("produto.created_at", "DESC");

  const [data, total] = await query.getManyAndCount();

  return {
    data,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

export const updateProduct = async (
  id: number,
  data: UpdateProductDTO
): Promise<ProductResponse> => {
  const product = await productRepository.findOne({
    where: { id: id },
  });
  if (!product) throw new AppError("Produto não encontrado.", 404);

  productRepository.merge(product, data);
  const updated = await productRepository.save(product);
  return updated;
};

export const deleteProduct = async (
  id: number
): Promise<{ message: string }> => {
  const product = await productRepository.findOne({
    where: { id: id },
  });
  if (!product) throw new AppError("Produto não encontrado.", 404);

  await productRepository.delete(id);
  return { message: "Produto removido com sucesso." };
};
