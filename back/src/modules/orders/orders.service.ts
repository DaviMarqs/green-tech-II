import { AppDataSource } from "../../database/data-source";
import { AppError } from "../../errors/AppError";
import type { CreateOrderDTO, OrderResponse } from "./orders.types";
import { In, type EntityManager } from "typeorm";
import { Pedido, PedidoStatus } from "../../entities/store/order.entity";
import { Produto } from "../../entities/store/product.entity";
import { Usuario } from "../../entities/user/users.entity";
import { PedidoProduto } from "../../entities/junctions/orderProduct.entity";
import { FormaPagamento } from "../../entities/store/paymentMethod.entity";
import { NotaFiscal } from "../../entities/store/notafiscal.entity";

const pedidoRepository = AppDataSource.getRepository(Pedido);
const produtoRepository = AppDataSource.getRepository(Produto);
const usuarioRepository = AppDataSource.getRepository(Usuario);
const formaPagamentoRepository = AppDataSource.getRepository(FormaPagamento);

export const createOrder = async (
  data: CreateOrderDTO
): Promise<OrderResponse> => {
  const { compradorId, vendedorId, formaPagamento, parcelas, produtos } = data;

  // 1. Validação da Forma de Pagamento
  const metodoPagamentoConfig = await formaPagamentoRepository.findOneBy({
    forma_pagamento: formaPagamento,
    ativo: true,
  });

  if (!metodoPagamentoConfig) {
    throw new AppError(
      `A forma de pagamento '${formaPagamento}' não está disponível.`,
      400
    );
  }

  // 2. Validação das Parcelas
  const parcelasSolicitadas = parcelas || 1; // Se não enviar, assume 1 (à vista)

  if (parcelasSolicitadas > metodoPagamentoConfig.parcelamento) {
    throw new AppError(
      `O parcelamento máximo para ${formaPagamento} é de ${metodoPagamentoConfig.parcelamento}x.`,
      400
    );
  }

  // 3. Buscas de Usuários e Produtos (Lógica existente)
  const comprador = await usuarioRepository.findOneBy({
    id_usuario: compradorId,
  });
  if (!comprador) throw new AppError("Comprador não encontrado", 404);

  const vendedor = await usuarioRepository.findOneBy({
    id_usuario: vendedorId,
  });
  if (!vendedor) throw new AppError("Vendedor não encontrado", 404);

  const idsProdutos = produtos.map((p) => p.idProduto);
  const produtosDb = await produtoRepository.findBy({
    id: In(idsProdutos),
  });

  let valorTotal = 0;
  const itensParaSalvar: { produto: Produto; quantidade: number }[] = [];

  for (const item of produtos) {
    const produtoDb = produtosDb.find((p) => p.id === item.idProduto);
    if (!produtoDb)
      throw new AppError(`Produto ${item.idProduto} não encontrado`, 404);

    if (produtoDb.estoque < item.quantidade)
      throw new AppError(
        `Estoque insuficiente para o produto ${produtoDb.nome}`,
        400
      );

    valorTotal += Number(produtoDb.preco) * item.quantidade;
    itensParaSalvar.push({ produto: produtoDb, quantidade: item.quantidade });
  }

  // 4. Transação para Salvar
  return AppDataSource.manager.transaction(
    async (transactionalEntityManager) => {
      const novoPedido = transactionalEntityManager.create(Pedido, {
        valor: valorTotal,
        forma_pagamento: formaPagamento,
        parcelas: parcelasSolicitadas,
        status: PedidoStatus.AGUARDANDO_PAGAMENTO,
        data_pedido: new Date(),
        id_usuario_comprador: comprador,
        id_usuario_vendedor: vendedor,
      });

      await transactionalEntityManager.save(novoPedido);

      for (const item of itensParaSalvar) {
        const novoItemPedido = transactionalEntityManager.create(
          PedidoProduto,
          {
            id_pedido: novoPedido.id_pedido,
            id_produto: item.produto.id,
            quantidade: item.quantidade,
            pedido: novoPedido,
            produto: item.produto,
          }
        );

        await transactionalEntityManager.save(novoItemPedido);

        const novoEstoque = item.produto.estoque - item.quantidade;
        await transactionalEntityManager.update(Produto, item.produto.id, {
          estoque: novoEstoque,
        });
      }

      return {
        id_pedido: novoPedido.id_pedido,
        valor: novoPedido.valor,
        forma_pagamento: novoPedido.forma_pagamento,
        parcelas: novoPedido.parcelas,
        status: novoPedido.status,
        data_pedido: novoPedido.data_pedido.toISOString(),
      };
    }
  );
};

export const listOrdersByUser = async (userId: number): Promise<Pedido[]> => {
  return pedidoRepository.find({
    where: [
      { id_usuario_comprador: { id_usuario: userId } },
      { id_usuario_vendedor: { id_usuario: userId } },
    ],
    order: { data_pedido: "DESC" },
    relations: ["id_usuario_comprador", "id_usuario_vendedor"],
  });
};

export const getOrderById = async (id: number): Promise<Pedido | null> => {
  const pedido = await pedidoRepository.findOne({
    where: { id_pedido: id },
    relations: [
      "id_usuario_comprador",
      "id_usuario_vendedor",
      "produtos",
      "produtos.produto",
    ],
  });

  return pedido;
};

export const updateOrderStatus = async (
  id: number,
  status: PedidoStatus,
  manager?: EntityManager
): Promise<Pedido> => {
  const repo = manager ? manager.getRepository(Pedido) : pedidoRepository;
  const notaRepo = manager
    ? manager.getRepository(NotaFiscal)
    : AppDataSource.getRepository(NotaFiscal);

  if (!Object.values(PedidoStatus).includes(status)) {
    throw new AppError("Status inválido.", 400);
  }

  const pedido = await repo.findOne({
    where: { id_pedido: id },
    relations: ["comprador"],
  });

  if (!pedido) {
    throw new AppError("Pedido não encontrado.", 404);
  }

  // Atualiza status
  await repo.update(id, {
    status,
    updated_at: new Date(),
  });

  /* ---------------------- CRIAR NOTA FISCAL AO PAGAR ---------------------- */
  if (status === PedidoStatus.PAGO) {
    // Verifica se já existe NF
    const existeNota = await notaRepo.findOne({
      where: { id_pedido: pedido.id_pedido },
    });

    if (!existeNota) {
      const nota = notaRepo.create({
        id_pedido: pedido.id_pedido,

        // DESTINATÁRIO (usuário)
        nome_destinatario: pedido.comprador?.nome ?? "",
        email_destinatario: pedido.comprador?.email ?? "",
        endereco_destinatario: "pedido.comprador?.endereco",
        cpf_cnpj_destinatario: pedido.comprador?.cpf_cnpj ?? "",

        // EMITENTE (dados fixos ou configuráveis)
        nome_razao_emitente: "GreenTech Solutions",
        cnpj_emitente: "12345678000199",
        email_emitente: "fiscal@greentech.com",
      });

      await notaRepo.save(nota);
    }
  }

  pedido.status = status;
  return pedido;
};
