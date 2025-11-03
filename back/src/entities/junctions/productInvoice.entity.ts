// src/entities/junctions/ProdutoNotaFiscal.entity.ts
import {
	Entity,
	Column,
	ManyToOne,
	JoinColumn,
	PrimaryColumn,
	CreateDateColumn,
} from "typeorm";
import { Produto } from "../store/product.entity.ts";
import { NotaFiscal } from "../store/invoice.entity.ts";

@Entity("gt_produto_notafiscal")
export class ProdutoNotaFiscal {
	@PrimaryColumn({ name: "id_produto" })
	id_produto: number;

	@PrimaryColumn({ name: "numero_nf" })
	numero_nf: number;

	@Column("integer")
	quantidade: number;

	// Relações
	@ManyToOne(
		() => Produto,
		(produto) => produto.notas_fiscais,
	)
	@JoinColumn({ name: "id_produto" })
	produto: Produto;

	@ManyToOne(
		() => NotaFiscal,
		(nf) => nf.produtos,
	)
	@JoinColumn({ name: "numero_nf", referencedColumnName: "numero" })
	nota_fiscal: NotaFiscal;

	@CreateDateColumn({ name: "created_at" })
	created_at: Date;
}
