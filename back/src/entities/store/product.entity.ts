import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { Avaliacao } from "./review.entity";
import { PedidoProduto } from "../junctions/orderProduct.entity";
import { ProdutoNotaFiscal } from "../junctions/productInvoice.entity";
import { Usuario } from "../user/users.entity";

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

	@Column("integer", { name: "id_usuario" })
	id_usuario: number;

	@ManyToOne(
		() => Usuario,
		(usuario) => usuario.produtos,
		{
			onDelete: "CASCADE",
		},
	)

	@JoinColumn({ name: "id_usuario" })
	usuario: Usuario;

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
