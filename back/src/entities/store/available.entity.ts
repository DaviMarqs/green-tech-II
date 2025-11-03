// src/entities/sales/Avaliacao.entity.ts
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	JoinColumn,
	Check,
} from "typeorm";
import { Usuario } from "../user/users.entity.ts";
import { Produto } from "./product.entity.ts";
import { Pedido } from "./order.entity.ts";

@Entity("gt_avaliacao")
@Check(`"nota" >= 1 AND "nota" <= 5`)
export class Avaliacao {
	@PrimaryGeneratedColumn("increment", { name: "id_avaliacao" })
	id_avaliacao: number;

	@Column("integer", { nullable: true })
	nota: number;

	@Column("varchar", { length: 200, nullable: true })
	descricao: string;

	// Relações
	@ManyToOne(
		() => Usuario,
		(usuario) => usuario.avaliacoes,
	)
	@JoinColumn({ name: "id_usuario" })
	id_usuario: Usuario;

	@ManyToOne(
		() => Produto,
		(produto) => produto.avaliacoes,
	)
	@JoinColumn({ name: "id_produto" })
	id_produto: Produto;

	@ManyToOne(
		() => Pedido,
		(pedido) => pedido.avaliacoes,
	)
	@JoinColumn({ name: "id_pedido" })
	id_pedido: Pedido;

	@CreateDateColumn({ name: "created_at" })
	created_at: Date;

	@UpdateDateColumn({ name: "updated_at", nullable: true })
	updated_at: Date;
}
