// src/entities/Cidade.entity.ts
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	OneToMany,
	JoinColumn,
} from "typeorm";
import { Estado } from "./estado.entity";
import { Bairro } from "./bairro.entity";

@Entity("gt_cidade")
export class Cidade {
	@PrimaryGeneratedColumn("increment", { name: "id_cidade" })
	id_cidade: number;

	@Column("varchar", { name: "nome_cidade", length: 100 })
	nome_cidade: string;

	// Relação: Muitas Cidades pertencem a um Estado
	@ManyToOne(
		() => Estado,
		(estado) => estado.cidades,
	)
	@JoinColumn({ name: "id_estado" }) // Chave estrangeira
	id_estado: Estado;

	// Relação: Uma Cidade tem muitos Bairros
	@OneToMany(
		() => Bairro,
		(bairro) => bairro.id_cidade,
	)
	bairros: Bairro[];

	@CreateDateColumn({ name: "created_at" })
	created_at: Date;

	@UpdateDateColumn({ name: "updated_at", nullable: true })
	updated_at: Date;
}
