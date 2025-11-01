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
import { Cidade } from "./Cidade.entity.ts";
import { Logradouro } from "./Logradouro.entity.ts";

@Entity("gt_bairro")
export class Bairro {
	@PrimaryGeneratedColumn("increment", { name: "id_bairro" })
	id_bairro: number;

	@Column("varchar", { name: "nome_bairro", length: 100 })
	nome_bairro: string;

	// Relação: Muitos Bairros pertencem a uma Cidade
	@ManyToOne(
		() => Cidade,
		(cidade) => cidade.bairros,
	)
	@JoinColumn({ name: "id_cidade" }) // Chave estrangeira
	id_cidade: Cidade;

	// Relação: Um Bairro tem muitos Logradouros
	@OneToMany(
		() => Logradouro,
		(logradouro) => logradouro.bairro,
	)
	logradouros: Logradouro[];

	@CreateDateColumn({ name: "created_at" })
	created_at: Date;

	@UpdateDateColumn({ name: "updated_at", nullable: true })
	updated_at: Date;
}
