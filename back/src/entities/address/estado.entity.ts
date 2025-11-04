// src/entities/Estado.entity.ts
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
} from "typeorm";
import { Cidade } from "./cidade.entity";

@Entity("gt_estado")
export class Estado {
	@PrimaryGeneratedColumn("increment", { name: "id_estado" })
	id: number;

	@Column("varchar", { name: "nome_estado", length: 100 })
	nome: string;

	@Column("varchar", { length: 2 })
	sigla: string;

	@CreateDateColumn({ name: "created_at" })
	created_at: Date;

	@UpdateDateColumn({ name: "updated_at", nullable: true })
	updated_at: Date;

	// Relação: Um Estado tem muitas Cidades
	@OneToMany(
		() => Cidade,
		(cidade) => cidade.id_estado,
	)
	cidades: Cidade[];
}
