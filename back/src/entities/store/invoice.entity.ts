// src/entities/sales/NotaFiscal.entity.ts
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	OneToOne,
	JoinColumn,
	OneToMany,
} from "typeorm";
import { Pedido } from "./order.entity";
import { ProdutoNotaFiscal } from "../junctions/productInvoice.entity";

@Entity("gt_notafiscal")
export class NotaFiscal {
	@PrimaryGeneratedColumn("increment", { name: "nf_numero" })
	nf_numero: number;

	@Column("varchar", { name: "nome_destinatario", length: 100, nullable: true })
	nome_destinatario: string;

	@Column("varchar", {
		name: "email_destinatario",
		length: 100,
		nullable: true,
	})
	email_destinatario: string;

	@Column("varchar", {
		name: "endereco_destinatario",
		length: 200,
		nullable: true,
	})
	endereco_destinatario: string;

	@OneToOne(
		() => Pedido,
		(pedido) => pedido.nota_fiscal,
	)
	@JoinColumn({ name: "id_pedido" })
	id_pedido: Pedido;

	@OneToMany(
		() => ProdutoNotaFiscal,
		(pnf) => pnf.nota_fiscal,
	)
	produtos: ProdutoNotaFiscal[];

	@CreateDateColumn({ name: "created_at" })
	created_at: Date;
}
