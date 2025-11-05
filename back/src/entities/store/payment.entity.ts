import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { Usuario } from "../user/users.entity";
import { Pedido } from "./order.entity";

export enum PagamentoStatus {
	PENDENTE = "PENDENTE",
	CONCLUIDO = "CONCLUIDO",
	FALHA = "FALHA",
}

@Entity("gt_pagamento")
export class Pagamento {
	@PrimaryGeneratedColumn("increment", { name: "id_pagamento" })
	id_pagamento: number;

	@Column("decimal", { precision: 10, scale: 2 })
	valor: number;

	@Column({
		type: "enum",
		enum: PagamentoStatus,
		default: PagamentoStatus.PENDENTE,
	})
	status: PagamentoStatus;

	@Column("varchar", { length: 50, name: "metodo_pagamento" })
	metodo_pagamento: string;

	@Column("integer", { nullable: true })
	parcelas: number;

	@Column("varchar", {
		length: 255,
		nullable: true,
		name: "id_transacao_externa",
	})
	id_transacao_externa: string;

	@ManyToOne(() => Pedido)
	@JoinColumn({ name: "id_pedido" })
	pedido: Pedido;

	@ManyToOne(() => Usuario)
	@JoinColumn({ name: "id_usuario" })
	usuario: Usuario;

	@CreateDateColumn({ name: "created_at" })
	created_at: Date;
}
