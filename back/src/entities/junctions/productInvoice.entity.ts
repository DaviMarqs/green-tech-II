// src/entities/junctions/ProdutoNotaFiscal.entity.ts
import {
	Entity,
	Column,
	ManyToOne,
	JoinColumn,
	PrimaryColumn,
	CreateDateColumn,
} from "typeorm";
import { Produto } from "../store/product.entity";
import { NotaFiscal } from "../store/invoice.entity";

@Entity("gt_produto_notafiscal")
export class ProdutoNotaFiscal {
	@PrimaryColumn({ name: "id_produto" })
	id_produto: number;

	@PrimaryColumn({ name: "numero_nf" })
	numero_nf: number;

	@Column("integer")
	quantidade: number;

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
	@JoinColumn({ name: "numero_nf" })
	nota_fiscal: NotaFiscal;

	@CreateDateColumn({ name: "created_at" })
	created_at: Date;
}
