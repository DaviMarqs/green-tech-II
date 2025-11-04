// src/entities/Bairro.entity.ts
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
import { Cidade } from "./cidade.entity";
import { Logradouro } from "./logradouro.entity";

@Entity("gt_bairro")
export class Bairro {
	@PrimaryGeneratedColumn("increment", { name: "id_bairro" })
	id_bairro: number;

	@Column("varchar", { name: "nome_bairro", length: 100 })
	nome_bairro: string;

	@ManyToOne(
		() => Cidade,
		(cidade) => cidade.bairros,
	)
	@JoinColumn({ name: "id_cidade" })
	id_cidade: Cidade;

	@OneToMany(
		() => Logradouro,
		(logradouro) => logradouro.id_bairro,
	)
	logradouros: Logradouro[];

	@CreateDateColumn({ name: "created_at" })
	created_at: Date;

	@UpdateDateColumn({ name: "updated_at", nullable: true })
	updated_at: Date;
}
