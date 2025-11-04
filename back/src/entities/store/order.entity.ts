// src/entities/sales/Pedido.entity.ts
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	OneToOne,
	OneToMany,
	JoinColumn,
	Check,
} from "typeorm";
import { Usuario } from "../user/users.entity";
import { NotaFiscal } from "./invoice.entity";
import { PedidoProduto } from "../junctions/orderProduct.entity";
import { Avaliacao } from "./available.entity";

export enum PedidoStatus {
	AGUARDANDO_PAGAMENTO = "AGUARDANDO_PAGAMENTO",
	PAGO = "PAGO",
	EM_TRANSPORTE = "EM_TRANSPORTE",
	ENTREGUE = "ENTREGUE",
	CANCELADO = "CANCELADO",
}

@Entity("gt_pedido")
@Check(
	`"status" IN ('AGUARDANDO_PAGAMENTO', 'PAGO', 'EM_TRANSPORTE', 'ENTREGUE', 'CANCELADO')`,
)
export class Pedido {
	@PrimaryGeneratedColumn("increment", { name: "id_pedido" })
	id_pedido: number;

	@Column("decimal", { precision: 10, scale: 2 })
	valor: number;

	@Column("date", { name: "data_pedido" })
	data_pedido: Date;

	@Column("varchar", { length: 50, name: "forma_pagamento" })
	forma_pagamento: string;

	@Column({
		type: "enum",
		enum: PedidoStatus,
	})
	status: PedidoStatus;

	@Column("integer", { nullable: true })
	parcelas: number;

	// Relações
	@ManyToOne(
		() => Usuario,
		(usuario) => usuario.pedidos_comprados,
	)
	@JoinColumn({ name: "id_usuario_comprador" })
	id_usuario_comprador: Usuario;

	@ManyToOne(
		() => Usuario,
		(usuario) => usuario.pedidos_vendidos,
	)
	@JoinColumn({ name: "id_usuario_vendedor" })
	id_usuario_vendedor: Usuario;

	@OneToOne(
		() => NotaFiscal,
		(nf) => nf.id_pedido,
	)
	nota_fiscal: NotaFiscal;

	@OneToMany(
		() => Avaliacao,
		(aval) => aval.id_pedido,
	)
	avaliacoes: Avaliacao[];

	@OneToMany(
		() => PedidoProduto,
		(pp) => pp.pedido,
	)
	produtos: PedidoProduto[];

	@CreateDateColumn({ name: "created_at" })
	created_at: Date;

	@UpdateDateColumn({ name: "updated_at", nullable: true })
	updated_at: Date;
}
