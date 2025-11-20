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
import { Usuario } from "../user/users.entity";
import { Produto } from "../store/product.entity";

@Entity("gt_avaliacao")
@Check(`"nota" >= 0 AND "nota" <= 5`)
export class Avaliacao {
	@PrimaryGeneratedColumn("increment", { name: "id_avaliacao" })
	id_avaliacao: number;

	@Column("integer")
	nota: number;

	@Column("varchar", { length: 200, nullable: true })
	descricao: string;

	// Relações
	@ManyToOne(
		() => Usuario,
		(usuario) => usuario.avaliacoes,
	)
	@JoinColumn({ name: "id_usuario" })
	usuario: Usuario;

	@Column({ name: "id_usuario" })
	id_usuario: number;

	@ManyToOne(
		() => Produto,
		(produto) => produto.avaliacoes,
	)
	@JoinColumn({ name: "id_produto" })
	produto: Produto;

	@Column({ name: "id_produto" })
	id_produto: number;

	//Ver com o time se faz sentido ter avaliacao do pedido
	// @ManyToOne(() => Pedido, (pedido) => pedido.avaliacoes, { nullable: true })
	// @JoinColumn({ name: "id_pedido" })
	// pedido: Pedido;

	@CreateDateColumn({ name: "created_at" })
	created_at: Date;

	@UpdateDateColumn({ name: "updated_at", nullable: true })
	updated_at: Date;
}
