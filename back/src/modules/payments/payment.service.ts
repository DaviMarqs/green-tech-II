import { AppDataSource } from "../../database/data-source";
import { AppError } from "../../errors/AppError";
import {
	Pagamento,
	PagamentoStatus,
} from "../../entities/store/payment.entity";
import { Pedido, PedidoStatus } from "../../entities/store/order.entity";
import { Usuario } from "../../entities/user/users.entity";
import type { CreatePaymentDTO, PaymentResponse } from "./payment.types";
import { updateOrderStatus } from "../orders/orders.service";

const processarGatewayExterno = async (
	dto: CreatePaymentDTO,
): Promise<{ success: boolean; transactionId: string }> => {
	console.log("Processando pagamento via gateway...");
	await new Promise((resolve) => setTimeout(resolve, 500));

	if (dto.valor > 0) {
		return { success: true, transactionId: `ext_${Date.now()}` };
	}
	return { success: false, transactionId: `fail_${Date.now()}` };
};

export const createPayment = async (
	dto: CreatePaymentDTO,
): Promise<PaymentResponse> => {
	return AppDataSource.manager.transaction(
		async (transactionalEntityManager) => {
			const pedidoRepo = transactionalEntityManager.getRepository(Pedido);
			const usuarioRepo = transactionalEntityManager.getRepository(Usuario);

			const pedido = await pedidoRepo.findOneBy({ id_pedido: dto.id_pedido });
			if (!pedido) throw new AppError("Pedido não encontrado", 404);

			const usuario = await usuarioRepo.findOneBy({
				id_usuario: dto.id_usuario,
			});
			if (!usuario) throw new AppError("Usuário não encontrado", 404);

			if (pedido.status !== PedidoStatus.AGUARDANDO_PAGAMENTO) {
				throw new AppError("Este pedido não está aguardando pagamento.", 400);
			}
			if (Number(pedido.valor) !== dto.valor) {
				throw new AppError("Valor do pagamento não confere com o pedido.", 400);
			}

			const gatewayResponse = await processarGatewayExterno(dto);

			let statusPagamento: PagamentoStatus = gatewayResponse.success
				? PagamentoStatus.CONCLUIDO
				: PagamentoStatus.FALHA;

			const novoPagamento = transactionalEntityManager.create(Pagamento, {
				valor: dto.valor,
				metodo_pagamento: dto.metodo_pagamento,
				parcelas: dto.parcelas || 1,
				status: statusPagamento,
				id_transacao_externa: gatewayResponse.transactionId,
				pedido: pedido,
				usuario: usuario,
			});
			await transactionalEntityManager.save(novoPagamento);

			if (statusPagamento === PagamentoStatus.CONCLUIDO) {
				await updateOrderStatus(
					pedido.id_pedido,
					PedidoStatus.PAGO,
					transactionalEntityManager,
				);
			}

			if (statusPagamento === PagamentoStatus.FALHA) {
				throw new AppError("Pagamento recusado pelo gateway.", 400);
			}

			return {
				id_pagamento: novoPagamento.id_pagamento,
				id_pedido: pedido.id_pedido,
				status: novoPagamento.status,
				valor: novoPagamento.valor,
				metodo: novoPagamento.metodo_pagamento,
			};
		},
	);
};
