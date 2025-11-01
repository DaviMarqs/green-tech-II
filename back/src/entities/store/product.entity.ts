// src/entities/sales/Produto.entity.ts
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
} from "typeorm";
import { Avaliacao } from "./Avaliacao.entity.ts";
import { PedidoProduto } from "../junctions/PedidoProduto.entity.ts";
import { ProdutoNotaFiscal } from "../junctions/ProdutoNotaFiscal.entity.ts";

@Entity("gt_produto")
export class Produto {
	@PrimaryGeneratedColumn("increment", { name: "id_produto" })
	id: number;

	@Column("varchar", { name: "nome_produto", length: 100 })
	nome: string;

	@Column("varchar", { length: 255, nullable: true })
	descricao: string;

	@Column("decimal", { precision: 10, scale: 2 })
	preco: number;

	@Column("integer", { name: "quantidade_estoque" })
	estoque: number;

	// Relações
	@OneToMany(
		() => Avaliacao,
		(aval) => aval.produto,
	)
	avaliacoes: Avaliacao[];

	@OneToMany(
		() => PedidoProduto,
		(pp) => pp.produto,
	)
	pedidos: PedidoProduto[];

	@OneToMany(
		() => ProdutoNotaFiscal,
		(pnf) => pnf.produto,
	)
	notas_fiscais: ProdutoNotaFiscal[];

	@CreateDateColumn({ name: "created_at" })
	created_at: Date;

	@UpdateDateColumn({ name: "updated_at", nullable: true })
	updated_at: Date;
}
