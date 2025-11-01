// src/entities/junctions/PedidoProduto.entity.ts
import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { Pedido } from "../sales/Pedido.entity.ts";
import { Produto } from "../sales/Produto.entity.ts";

@Entity("gt_pedido_produto")
export class PedidoProduto {
	@PrimaryColumn({ name: "id_pedido" })
	id_pedido: number;

	@PrimaryColumn({ name: "id_produto" })
	id_produto: number;

	@Column("integer")
	quantidade: number;

	// Relações
	@ManyToOne(
		() => Pedido,
		(pedido) => pedido.produtos,
	)
	@JoinColumn({ name: "id_pedido" })
	pedido: Pedido;

	@ManyToOne(
		() => Produto,
		(produto) => produto.pedidos,
	)
	@JoinColumn({ name: "id_produto" })
	produto: Produto;
}
