import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { Usuario } from "./users.entity";

@Entity("gt_dados_consumo")
export class DadosConsumo {
	@PrimaryGeneratedColumn("increment", { name: "id_dados_consumo" })
	id_dados_consumo: number;

	@Column("integer", { name: "consumo_energia", nullable: true })
	consumo_energia: number;

	@Column("decimal", {
		precision: 10,
		scale: 2,
		name: "taxa_distribuidora",
		nullable: true,
	})
	taxa_distribuidora: number;

	@Column("varchar", { length: 100, nullable: true })
	descricao: string;

	@ManyToOne(
		() => Usuario,
		(usuario) => usuario.dados_consumo,
	)
	@JoinColumn({ name: "id_usuario" })
	id_usuario: Usuario;

	@CreateDateColumn({ name: "created_at" })
	created_at: Date;

	@UpdateDateColumn({ name: "updated_at", nullable: true })
	updated_at: Date;
}
