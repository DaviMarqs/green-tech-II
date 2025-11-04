import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToMany,
} from "typeorm";
import { Usuario } from "./users.entity";

@Entity("gt_categorias")
export class Categoria {
	@PrimaryGeneratedColumn("increment", { name: "id_categoria" })
	id_categoria: number;

	@Column("varchar", { length: 100 })
	descricao: string;

	@CreateDateColumn({ name: "created_at" })
	created_at: Date;

	@UpdateDateColumn({ name: "updated_at", nullable: true })
	updated_at: Date;

	// Relação: Muitas Categorias para Muitos Usuários
	@ManyToMany(
		() => Usuario,
		(usuario) => usuario.categorias,
	)
	usuarios: Usuario[];
}
