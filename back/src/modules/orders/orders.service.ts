import { AppDataSource } from "../../database/data-source";
import { AppError } from "../../errors/AppError";
import type { CreateOrderDTO, OrderResponse } from "./orders.types";
import { In, type EntityManager } from "typeorm";
import { Pedido, PedidoStatus } from "../../entities/store/order.entity";
import { Produto } from "../../entities/store/product.entity";
import { Usuario } from "../../entities/user/users.entity";
import { PedidoProduto } from "../../entities/junctions/orderProduct.entity";

const pedidoRepository = AppDataSource.getRepository(Pedido);
const produtoRepository = AppDataSource.getRepository(Produto);
const usuarioRepository = AppDataSource.getRepository(Usuario);

export const createOrder = async (
	data: CreateOrderDTO,
): Promise<OrderResponse> => {
	const { compradorId, vendedorId, formaPagamento, produtos } = data;

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
			// Usando 'estoque'
			throw new AppError(
				`Estoque insuficiente para o produto ${produtoDb.nome}`,
				400,
			);

		valorTotal += Number(produtoDb.preco) * item.quantidade;
		itensParaSalvar.push({ produto: produtoDb, quantidade: item.quantidade });
	}

	return AppDataSource.manager.transaction(
		async (transactionalEntityManager) => {
			const novoPedido = transactionalEntityManager.create(Pedido, {
				valor: valorTotal,
				forma_pagamento: formaPagamento,
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
					},
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
				status: novoPedido.status,
				data_pedido: novoPedido.data_pedido.toISOString(),
			};
		},
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
	manager?: EntityManager,
): Promise<Pedido> => {
	if (!Object.values(PedidoStatus).includes(status)) {
		throw new AppError("Status inválido.", 400);
	}

	const repository = manager ? manager.getRepository(Pedido) : pedidoRepository;

	const pedido = await repository.findOneBy({ id_pedido: id });
	if (!pedido) {
		throw new AppError("Pedido não encontrado.", 404);
	}

	await repository.update(id, {
		status: status,
		updated_at: new Date(),
	});

	pedido.status = status;
	return pedido;
};
