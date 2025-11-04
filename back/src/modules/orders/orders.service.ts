import { AppDataSource } from "../../database/data-source";
import { AppError } from "../../errors/AppError";
import type { CreateOrderDTO, OrderResponse } from "./orders.types";

export const createOrder = async (
  data: CreateOrderDTO
): Promise<OrderResponse> => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const { compradorId, vendedorId, formaPagamento, produtos } = data;

    // 1️⃣ Busca os produtos
    const produtosDb = await queryRunner.query(
      `SELECT id_produto, preco, quantidade_estoque FROM gt_produto WHERE id_produto = ANY($1::int[])`,
      [produtos.map((p) => p.idProduto)]
    );

    if (produtosDb.length === 0)
      throw new AppError("Nenhum produto encontrado", 404);

    // 2️⃣ Calcula valor total
    let valorTotal = 0;
    for (const item of produtos) {
      const produto = produtosDb.find(
        (p: any) => p.id_produto === item.idProduto
      );
      if (!produto)
        throw new AppError(`Produto ${item.idProduto} não encontrado`, 404);
      if (produto.quantidade_estoque < item.quantidade)
        throw new AppError(
          `Estoque insuficiente para o produto ${item.idProduto}`,
          400
        );

      valorTotal += Number(produto.preco) * item.quantidade;
    }

    // 3️⃣ Cria o pedido
    const pedido = await queryRunner.query(
      `INSERT INTO gt_pedido (valor, data_pedido, forma_pagamento, status, id_usuario_comprador, id_usuario_vendedor, created_at)
       VALUES ($1, NOW(), $2, 'AGUARDANDO_PAGAMENTO', $3, $4, NOW())
       RETURNING *`,
      [valorTotal, formaPagamento, compradorId, vendedorId]
    );

    const pedidoId = pedido[0].id_pedido;

    // 4️⃣ Vincula produtos e atualiza estoque
    for (const item of produtos) {
      await queryRunner.query(
        `INSERT INTO gt_pedido_produto (id_pedido, id_produto, quantidade)
         VALUES ($1, $2, $3)`,
        [pedidoId, item.idProduto, item.quantidade]
      );

      await queryRunner.query(
        `UPDATE gt_produto
         SET quantidade_estoque = quantidade_estoque - $1
         WHERE id_produto = $2`,
        [item.quantidade, item.idProduto]
      );
    }

    // ✅ Finaliza a transação
    await queryRunner.commitTransaction();

    return {
      id_pedido: pedidoId,
      valor: valorTotal,
      status: "AGUARDANDO_PAGAMENTO",
      forma_pagamento: formaPagamento,
      data_pedido: new Date().toISOString(),
    };
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

export const listOrdersByUser = async (userId: number) => {
  const pedidos = await AppDataSource.query(
    `SELECT * FROM gt_pedido WHERE id_usuario_comprador = $1 OR id_usuario_vendedor = $1 ORDER BY data_pedido DESC`,
    [userId]
  );
  return pedidos;
};

export const getOrderById = async (id: number) => {
  const pedido = await AppDataSource.query(
    `SELECT * FROM gt_pedido WHERE id_pedido = $1`,
    [id]
  );
  if (pedido.length === 0) return null;

  const produtos = await AppDataSource.query(
    `SELECT p.*, pp.quantidade
     FROM gt_pedido_produto pp
     JOIN gt_produto p ON p.id_produto = pp.id_produto
     WHERE pp.id_pedido = $1`,
    [id]
  );

  return { ...pedido[0], produtos };
};

export const updateOrderStatus = async (id: number, status: string) => {
  const validStatuses = [
    "AGUARDANDO_PAGAMENTO",
    "PAGO",
    "EM_TRANSPORTE",
    "ENTREGUE",
    "CANCELADO",
  ];
  if (!validStatuses.includes(status)) {
    throw new AppError("Status inválido.", 400);
  }

  const updated = await AppDataSource.query(
    `UPDATE gt_pedido SET status = $1, updated_at = NOW() WHERE id_pedido = $2 RETURNING *`,
    [status, id]
  );

  if (updated.length === 0) throw new AppError("Pedido não encontrado.", 404);

  return updated[0];
};
