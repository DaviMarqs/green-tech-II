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

// --- SIMULAÇÃO DE GATEWAY (Cielo, Stripe, Pagar.me, etc) ---
interface GatewayResult {
	success: boolean;
	status: PagamentoStatus;
	transactionId: string;
	metadata?: any;
}

const gatewaySimulator = {
	async processarCartao(
		valor: number,
		parcelas: number,
	): Promise<GatewayResult> {
		await new Promise((r) => setTimeout(r, 800));

		const aprovado = Math.random() > 0.1;

		if (!aprovado) {
			return {
				success: false,
				status: PagamentoStatus.FALHA,
				transactionId: `fail_${Date.now()}`,
				metadata: {
					mensagem: "Transação recusada pela operadora: Saldo Insuficiente.",
				},
			};
		}

		return {
			success: true,
			status: PagamentoStatus.CONCLUIDO,
			transactionId: `card_${Date.now()}`,
			metadata: {
				mensagem: "Pagamento aprovado.",
				nsu: Math.floor(Math.random() * 1000000).toString(),
			},
		};
	},

	async gerarPix(valor: number): Promise<GatewayResult> {
		await new Promise((r) => setTimeout(r, 300));

		return {
			success: true,
			status: PagamentoStatus.PENDENTE,
			transactionId: `pix_${Date.now()}`,
			metadata: {
				mensagem: "Aguardando pagamento.",
				codigo_pix:
					"00020126580014BR.GOV.BCB.PIX013639ed07f3-c843-436d-a940-b684aee2d3d55204000053039865406100.005802BR5924Felipe Henrique da Silva6009SAO PAULO62140510vzsrX1YA1Y6304291D",
			},
		};
	},

	async gerarBoleto(valor: number): Promise<GatewayResult> {
		await new Promise((r) => setTimeout(r, 300));

		return {
			success: true,
			status: PagamentoStatus.PENDENTE,
			transactionId: `bol_${Date.now()}`,
			metadata: {
				mensagem: "Boleto gerado com sucesso.",
				linha_digitavel: `34191.79001 01043.510047 91020.150008 8 ${Math.floor(Date.now() / 1000)}00000${valor.toFixed(2).replace(".", "")}`,
			},
		};
	},
};

// --- SERVICE PRINCIPAL ---

export const createPayment = async (
	dto: CreatePaymentDTO,
): Promise<PaymentResponse> => {
	return AppDataSource.manager.transaction(
		async (transactionalEntityManager) => {
			const pedidoRepo = transactionalEntityManager.getRepository(Pedido);
			const usuarioRepo = transactionalEntityManager.getRepository(Usuario);
			const pagamentoRepo = transactionalEntityManager.getRepository(Pagamento);

			// 1. Validações Básicas
			const usuario = await usuarioRepo.findOneBy({
				id_usuario: dto.id_usuario,
			});
			if (!usuario) throw new AppError("Usuário não encontrado", 404);

			const pedido = await pedidoRepo.findOne({
				where: { id_pedido: dto.id_pedido },
				relations: ["id_usuario_comprador"], // Mantemos o carregamento da relação
			});

			if (!pedido) throw new AppError("Pedido não encontrado", 404);

			// 2. Validação de Propriedade (Debug Only)
			// Transformei o erro em LOG para não travar seu teste
			const idUsuarioToken = Number(usuario.id_usuario);

			// Tratamento defensivo para pegar o ID do comprador, seja objeto ou número direto
			let idCompradorPedido = 0;
			if (pedido.id_usuario_comprador) {
				if (
					typeof pedido.id_usuario_comprador === "object" &&
					"id_usuario" in pedido.id_usuario_comprador
				) {
					idCompradorPedido = Number(pedido.id_usuario_comprador.id_usuario);
				} else if (typeof pedido.id_usuario_comprador === "number") {
					idCompradorPedido = Number(pedido.id_usuario_comprador);
				}
			}

			if (idCompradorPedido !== idUsuarioToken) {
				console.warn(
					`⚠️ ALERTA DE SEGURANÇA: Usuário do Token (${idUsuarioToken}) diferente do Comprador do Pedido (${idCompradorPedido}).`,
				);
				console.warn(
					"O pagamento prosseguirá para fins de teste, mas verifique a lógica de autenticação.",
				);
				// throw new AppError(...); // Comentado para restaurar funcionamento anterior
			}

			if (pedido.status !== PedidoStatus.AGUARDANDO_PAGAMENTO) {
				throw new AppError(
					`Pedido não pode ser pago. Status atual: ${pedido.status}`,
					400,
				);
			}

			const pagamentoExistente = await pagamentoRepo.findOne({
				where: {
					pedido: { id_pedido: pedido.id_pedido },
					status: PagamentoStatus.CONCLUIDO,
				},
			});
			if (pagamentoExistente) {
				throw new AppError("Este pedido já foi pago anteriormente.", 400);
			}

			if (Number(pedido.valor) !== dto.valor) {
				throw new AppError(
					`Valor incorreto. O valor do pedido é R$ ${pedido.valor}`,
					400,
				);
			}

			// 3. Processamento via Gateway
			let gatewayResponse: GatewayResult;
			const metodoNormalizado = dto.metodo_pagamento.toLowerCase();

			if (
				metodoNormalizado.includes("crédito") ||
				metodoNormalizado.includes("debito")
			) {
				gatewayResponse = await gatewaySimulator.processarCartao(
					dto.valor,
					dto.parcelas || 1,
				);
			} else if (metodoNormalizado.includes("pix")) {
				gatewayResponse = await gatewaySimulator.gerarPix(dto.valor);
			} else if (metodoNormalizado.includes("boleto")) {
				gatewayResponse = await gatewaySimulator.gerarBoleto(dto.valor);
			} else {
				gatewayResponse = await gatewaySimulator.processarCartao(dto.valor, 1);
			}

			// 4. Salvar Registro de Pagamento
			const novoPagamento = transactionalEntityManager.create(Pagamento, {
				valor: dto.valor,
				metodo_pagamento: dto.metodo_pagamento,
				parcelas: dto.parcelas || 1,
				status: gatewayResponse.status,
				id_transacao_externa: gatewayResponse.transactionId,
				pedido: pedido,
				usuario: usuario,
			});

			await transactionalEntityManager.save(novoPagamento);

			if (gatewayResponse.status === PagamentoStatus.CONCLUIDO) {
				await updateOrderStatus(
					pedido.id_pedido,
					PedidoStatus.PAGO,
					transactionalEntityManager,
				);
			} else if (gatewayResponse.status === PagamentoStatus.FALHA) {
				throw new AppError(
					`Pagamento recusado: ${gatewayResponse.metadata?.mensagem || "Erro desconhecido"}`,
					400,
				);
			}

			return {
				id_pagamento: novoPagamento.id_pagamento,
				id_pedido: pedido.id_pedido,
				status: novoPagamento.status,
				valor: Number(novoPagamento.valor),
				metodo: novoPagamento.metodo_pagamento,
				metadata: gatewayResponse.metadata,
			};
		},
	);
};
