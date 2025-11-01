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
import { Pedido } from "./order.entity.ts";
import { ProdutoNotaFiscal } from "../junctions/ProdutoNotaFiscal.entity.ts";

@Entity("gt_notafiscal")
export class NotaFiscal {
	@PrimaryGeneratedColumn("increment", { name: "nf_numero" })
	nf_numero: number;

	@Column("varchar", { name: "nome_destinatario", length: 100, nullable: true })
	nome_destinatario: string;

	// ...outras colunas de destinatário e emitente...
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

	// ...etc

	// Relação: Uma NotaFiscal pertence a um Pedido
	@OneToOne(
		() => Pedido,
		(pedido) => pedido.nota_fiscal,
	)
	@JoinColumn({ name: "id_pedido" })
	id_pedido: Pedido;

	// Relação com a tabela de junção
	@OneToMany(
		() => ProdutoNotaFiscal,
		(pnf) => pnf.nota_fiscal,
	)
	produtos: ProdutoNotaFiscal[];

	@CreateDateColumn({ name: "created_at" })
	created_at: Date;
}
